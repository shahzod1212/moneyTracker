package com.example.money_manager.service;

import com.example.money_manager.dtos.AiCategoryResponse;
import com.example.money_manager.dtos.AiDto;
import com.example.money_manager.dtos.AiRequest;
import com.example.money_manager.dtos.CategoryDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.secret.api-key}")
    private String apiKey;

    @Value("${ai.openai.base-url}")
    private String baseUrl;

    @Value("${ai.openai.model}")
    private String model;

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AiDto ask(AiRequest request) {
        String prompt = buildPrompt(request);
        String rawAnswer = callOpenAi(prompt);
        return parseAnswer(request, rawAnswer);
    }

    public AiCategoryResponse suggestCategoryForGoal(String goalName, List<CategoryDto> categories) {
        String prompt = buildCategoryPrompt(goalName, categories);
        String rawAnswer = callOpenAi(prompt);
        return parseCategoryAnswer(categories, rawAnswer);
    }

    private String buildPrompt(AiRequest request) {
        StringBuilder sb = new StringBuilder();

        sb.append("You are a financial assistant helping a user with their personal finances. ");

        if (request.getDashboardData() != null && !request.getDashboardData().isEmpty()) {
            sb.append("Here is the user's current financial data: ")
                    .append(request.getDashboardData())
                    .append(". ");
        }

        sb.append("The user's question is: \"").append(request.getQuestion()).append("\". ");

        sb.append("Respond ONLY with valid JSON in this exact format, with no extra text, ")
                .append("no markdown,and provide the answer based on user questions your answers should not be general, it should address to the question and clarify the user question,  and no explanation outside the JSON: ")
                .append("{\"summary\": \"a detailed overview answer\", ")
                .append("\"recommendations\": [\"recommendation 1\", \"recommendation 2\"]}");

        return sb.toString();
    }

    private String buildCategoryPrompt(String goalName, List<CategoryDto> categories) {
        StringBuilder sb = new StringBuilder();

        sb.append("You are helping classify a completed financial goal into an expense category. ");
        sb.append("The goal that was just completed is named: \"").append(goalName).append("\". ");

        sb.append("Here is the list of the user's existing expense categories, each with an id and a name: ");
        for (CategoryDto category : categories) {
            sb.append("{id: ").append(category.getId())
                    .append(", name: \"").append(category.getName()).append("\"}, ");
        }

        sb.append("Decide if the goal fits naturally into one of these existing categories. ");
        sb.append("Only match an existing category if it is a genuinely good semantic fit, not a loose guess. ");
        sb.append("If none of the existing categories fit well, propose a new, short, clear category name based on the goal itself. ");

        sb.append("Respond ONLY with valid JSON in this exact format, with no extra text and no markdown: ")
                .append("{\"categoryId\": <the id of the matching existing category, or null if none fit>, ")
                .append("\"categoryName\": \"<the existing category's name if matched, otherwise the new category name you propose>\", ")
                .append("\"type\": \"<the existing category's type if matched, otherwise the new type you propose>\", ")
                .append("\"budget\": \"<the existing category's budget if matched, otherwise the new budget you propose>\", ")
                .append("\"icon\": \"<the existing category's icon if matched, otherwise the new icon you propose>\", ")
                .append("\"isNew\": <true if you are proposing a brand new category, false if you matched an existing one>}");

        return sb.toString();
    }

    private String callOpenAi(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(message),
                "max_tokens", 500
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(baseUrl, entity, Map.class);

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> messageObj = (Map<String, Object>) firstChoice.get("message");

            return (String) messageObj.get("content");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get a response from the AI provider", e);
        }
    }

    private AiDto parseAnswer(AiRequest request, String rawAnswer) {
        String cleaned = rawAnswer == null
                ? ""
                : rawAnswer.replace("```json", "").replace("```", "").trim();

        try {
            JsonNode node = objectMapper.readTree(cleaned);

            String summary = node.has("summary") ? node.get("summary").asText() : cleaned;

            List<String> recommendations = new ArrayList<>();
            if (node.has("recommendations") && node.get("recommendations").isArray()) {
                node.get("recommendations").forEach(item -> recommendations.add(item.asText()));
            }

            return AiDto.builder()
                    .type(request.getType())
                    .question(request.getQuestion())
                    .summary(summary)
                    .recommendations(recommendations)
                    .build();

        } catch (Exception e) {
            return AiDto.builder()
                    .type(request.getType())
                    .question(request.getQuestion())
                    .summary(cleaned)
                    .recommendations(new ArrayList<>())
                    .build();
        }
    }

    private AiCategoryResponse parseCategoryAnswer(List<CategoryDto> categories, String rawAnswer) {
        String cleaned = rawAnswer == null
                ? ""
                : rawAnswer.replace("```json", "").replace("```", "").trim();

        try {
            JsonNode node = objectMapper.readTree(cleaned);

            boolean isNew = node.has("isNew") && node.get("isNew").asBoolean();
            String categoryName = node.has("categoryName") ? node.get("categoryName").asText() : null;
            String type = node.has("type") ? node.get("type").asText() : null;
            BigDecimal budget = node.has("budget") && !node.get("budget").isNull()
                    ? new BigDecimal(node.get("budget").asText())
                    : null;
            String icon = node.has("icon") ? node.get("icon").asText() : null;

            Long categoryId = null;
            if (!isNew && node.has("categoryId") && !node.get("categoryId").isNull()) {
                Long candidateId = node.get("categoryId").asLong();
                boolean idExists = categories.stream()
                        .anyMatch(category -> category.getId().equals(candidateId));
                if (idExists) {
                    categoryId = candidateId;
                } else {
                    isNew = true;
                }
            }

            return AiCategoryResponse.builder()
                    .categoryId(categoryId)
                    .categoryName(categoryName)
                    .type(type)
                    .budget(budget)
                    .icon(icon)
                    .isNew(isNew)
                    .build();

        } catch (Exception e) {
            return AiCategoryResponse.builder()
                    .categoryId(null)
                    .categoryName(categories.isEmpty() ? "General" : categories.get(0).getName())
                    .isNew(categories.isEmpty())
                    .build();
        }
    }
}