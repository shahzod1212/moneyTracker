package com.example.money_manager.service;

import com.example.money_manager.dtos.GoalDto;
import com.example.money_manager.dtos.GoalRequest;
import com.example.money_manager.dtos.GoalUpdateRequest;

import java.math.BigDecimal;
import java.util.List;

public interface GoalService {

    GoalDto createGoal(GoalRequest goalRequest);

    GoalDto getGoalById(Long goalId);

    List<GoalDto> getAllGoals();

    List<GoalDto> getGoalsByProfile(Long profileId);

    GoalDto updateGoal(Long goalId, GoalRequest goalRequest);

    GoalDto updateCurrentAmount(GoalUpdateRequest goalUpdateRequest);

    GoalDto completeGoal(Long goalId);

    GoalDto cancelGoal(Long goalId);

    GoalDto reopenGoal(Long goalId);

    void deleteGoal(Long goalId);
}