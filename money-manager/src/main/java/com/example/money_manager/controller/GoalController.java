package com.example.money_manager.controller;

import com.example.money_manager.dtos.GoalDto;
import com.example.money_manager.dtos.GoalRequest;
import com.example.money_manager.dtos.GoalUpdateRequest;
import com.example.money_manager.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalDto> createGoal(@RequestBody GoalRequest goalRequest) {
        return new ResponseEntity<>(goalService.createGoal(goalRequest), HttpStatus.CREATED);
    }

    @GetMapping("/{goalId}")
    public ResponseEntity<GoalDto> getGoalById(@PathVariable Long goalId) {
        return ResponseEntity.ok(goalService.getGoalById(goalId));
    }

    @GetMapping
    public ResponseEntity<List<GoalDto>> getAllGoals() {
        return ResponseEntity.ok(goalService.getAllGoals());
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<GoalDto>> getGoalsByProfile(@PathVariable Long profileId) {
        return ResponseEntity.ok(goalService.getGoalsByProfile(profileId));
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<GoalDto> updateGoal(
            @PathVariable Long goalId,
            @RequestBody GoalRequest goalRequest) {

        return ResponseEntity.ok(goalService.updateGoal(goalId, goalRequest));
    }

    @PatchMapping("/current-amount")
    public ResponseEntity<GoalDto> updateCurrentAmount(
            @RequestBody GoalUpdateRequest goalUpdateRequest) {

        return ResponseEntity.ok(goalService.updateCurrentAmount(goalUpdateRequest));
    }

    @PatchMapping("/{goalId}/complete")
    public ResponseEntity<GoalDto> completeGoal(@PathVariable Long goalId) {
        return ResponseEntity.ok(goalService.completeGoal(goalId));
    }

    @PatchMapping("/{goalId}/cancel")
    public ResponseEntity<GoalDto> cancelGoal(@PathVariable Long goalId) {
        return ResponseEntity.ok(goalService.cancelGoal(goalId));
    }

    @PatchMapping("/{goalId}/reopen")
    public ResponseEntity<GoalDto> reopenGoal(@PathVariable Long goalId) {
        return ResponseEntity.ok(goalService.reopenGoal(goalId));
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId) {
        goalService.deleteGoal(goalId);
        return ResponseEntity.noContent().build();
    }
}