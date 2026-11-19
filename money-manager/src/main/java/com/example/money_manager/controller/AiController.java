package com.example.money_manager.controller;

import com.example.money_manager.dtos.AiDto;
import com.example.money_manager.dtos.AiRequest;
import com.example.money_manager.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/ask")
    public ResponseEntity<AiDto> ask(@RequestBody AiRequest request) {
        AiDto response = aiService.ask(request);
        return ResponseEntity.ok(response);
    }
}