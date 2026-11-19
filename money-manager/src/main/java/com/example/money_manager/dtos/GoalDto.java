package com.example.money_manager.dtos;

import com.example.money_manager.domain.enums.GoalPriority;
import com.example.money_manager.domain.enums.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalDto {

    private Long id;
    private Long profileId;
    private String name;
    private String icon;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private GoalStatus status;
    private LocalDate deadline;
    private GoalPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private LocalDateTime completedAt;
}