package com.example.money_manager.dtos;

import com.example.money_manager.domain.enums.GoalPriority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalRequest {
    private Long userId;
    private String name;
    private String icon;
    private BigDecimal targetAmount;
    private LocalDate deadline;
    private GoalPriority priority;
}