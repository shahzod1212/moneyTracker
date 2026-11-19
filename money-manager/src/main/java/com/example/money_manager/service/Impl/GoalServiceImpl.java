package com.example.money_manager.service.Impl;

import com.example.money_manager.domain.Goal;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.domain.enums.GoalStatus;
import com.example.money_manager.dtos.AiCategoryResponse;
import com.example.money_manager.dtos.CategoryDto;
import com.example.money_manager.dtos.CategoryRequest;
import com.example.money_manager.dtos.ExpenseRequest;
import com.example.money_manager.dtos.GoalDto;
import com.example.money_manager.dtos.GoalRequest;
import com.example.money_manager.dtos.GoalUpdateRequest;
import com.example.money_manager.mapper.GoalMapper;
import com.example.money_manager.repository.GoalRepository;
import com.example.money_manager.repository.ProfileRepository;
import com.example.money_manager.service.AiService;
import com.example.money_manager.service.CategoryService;
import com.example.money_manager.service.ExpenseService;
import com.example.money_manager.service.GoalService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalMapper goalMapper;
    private final GoalRepository goalRepository;
    private final ProfileRepository profileRepository;
    private final ExpenseService expenseService;
    private final AiService aiService;
    private final CategoryService categoryService;

    @Override
    public GoalDto createGoal(GoalRequest goalRequest) {
        Profile profile = profileRepository.findById(goalRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Goal goal = goalMapper.toEntity(goalRequest);
        goal.setProfile(profile);
        goal.setStatus(GoalStatus.IN_PROGRESS);
        goal.setCurrentAmount(BigDecimal.ZERO);

        Goal saved = goalRepository.save(goal);
        return goalMapper.toDto(saved);
    }

    @Override
    public GoalDto getGoalById(Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        return goalMapper.toDto(goal);
    }

    @Override
    public List<GoalDto> getAllGoals() {
        return goalRepository.findAll()
                .stream()
                .map(goalMapper::toDto)
                .toList();
    }

    @Override
    public List<GoalDto> getGoalsByProfile(Long profileId) {
        return goalRepository.findByProfileId(profileId)
                .stream()
                .map(goalMapper::toDto)
                .toList();
    }

    @Override
    public GoalDto updateGoal(Long goalId, GoalRequest goalRequest) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setName(goalRequest.getName());
        goal.setIcon(goalRequest.getIcon());
        goal.setTargetAmount(goalRequest.getTargetAmount());
        goal.setDeadline(goalRequest.getDeadline());
        goal.setPriority(goalRequest.getPriority());

        Goal updatedGoal = goalRepository.save(goal);

        return goalMapper.toDto(updatedGoal);
    }

    @Override
    public GoalDto updateCurrentAmount(GoalUpdateRequest goalUpdateRequest) {

        Goal goal = goalRepository.findById(goalUpdateRequest.getGoalId())
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        BigDecimal difference = goal.getTargetAmount().subtract(goal.getCurrentAmount());

        if (goalUpdateRequest.getAmount().compareTo(difference) > 0) {
            throw new RuntimeException("Amount is more than the remaining target.");
        }

        goal.setCurrentAmount(goal.getCurrentAmount().add(goalUpdateRequest.getAmount()));

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) == 0) {
            Goal saved = finalizeGoalCompletion(goal);
            return goalMapper.toDto(saved);
        }

        Goal saved = goalRepository.save(goal);
        return goalMapper.toDto(saved);
    }

    @Override
    @Transactional
    public GoalDto completeGoal(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setCurrentAmount(goal.getTargetAmount());

        Goal saved = finalizeGoalCompletion(goal);

        return goalMapper.toDto(saved);
    }

    /**
     * Marks the goal as completed, asks the AI to categorize it, creates/reuses
     * the category, and logs the goal amount as an expense. Used both when a
     * goal is explicitly completed and when funding reaches 100% naturally.
     */
    private Goal finalizeGoalCompletion(Goal goal) {
        goal.setStatus(GoalStatus.COMPLETED);
        goal.setCompletedAt(LocalDateTime.now());

        Goal saved = goalRepository.save(goal);

        List<CategoryDto> existingCategories = categoryService.getCategoryForCurrentUser();

        AiCategoryResponse categorySuggestion = aiService.suggestCategoryForGoal(saved.getName(), existingCategories);

        Long categoryId;
        if (categorySuggestion.isNew()) {
            CategoryRequest newCategoryRequest = new CategoryRequest();
            newCategoryRequest.setName(categorySuggestion.getCategoryName());
            newCategoryRequest.setType(categorySuggestion.getType());
            newCategoryRequest.setBudget(categorySuggestion.getBudget());
            newCategoryRequest.setIcon(categorySuggestion.getIcon());

            CategoryDto createdCategory = categoryService.create(newCategoryRequest);
            categoryId = createdCategory.getId();
        } else {
            categoryId = categorySuggestion.getCategoryId();
        }

        ExpenseRequest expenseRequest = new ExpenseRequest();
        expenseRequest.setName(saved.getName());
        expenseRequest.setIcon(saved.getIcon());
        expenseRequest.setDate(LocalDate.now());
        expenseRequest.setAmount(saved.getTargetAmount());
        expenseRequest.setCategoryId(categoryId);
        expenseService.create(expenseRequest);

        return saved;
    }

    @Override
    public GoalDto cancelGoal(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setStatus(GoalStatus.CANCELLED);

        Goal saved = goalRepository.save(goal);

        return goalMapper.toDto(saved);
    }

    @Override
    public GoalDto reopenGoal(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setStatus(GoalStatus.IN_PROGRESS);
        goal.setCompletedAt(null);

        Goal saved = goalRepository.save(goal);

        return goalMapper.toDto(saved);
    }

    @Override
    public void deleteGoal(Long goalId) {

        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goalRepository.delete(goal);
    }
}