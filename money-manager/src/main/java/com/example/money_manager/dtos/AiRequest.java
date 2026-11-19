package com.example.money_manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiRequest {
    private String type;
    private String question;
    private Map<String, Object> dashboardData;
}
