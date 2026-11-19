package com.example.money_manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalUpdateRequest {
    private Long goalId;
    private BigDecimal amount;

}
