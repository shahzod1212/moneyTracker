package com.example.money_manager.controller;

import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.TeamDto;
import com.example.money_manager.service.ProfileService;
import com.example.money_manager.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final ProfileService profileService;

    @PostMapping("/teams/invite/{profileId}")
    public ResponseEntity<Void> sendInvitationToMember(
            @PathVariable("profileId") Long profileId) {
        Long ownerId = profileService.getCurrentProfileDto(null).getId();
        teamService.sendInvitationToMember(ownerId, profileId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/teams/accept")
    public ResponseEntity<TeamDto> acceptingInvitation(
            @RequestParam("ownerId") Long ownerId) {
        Long userId = profileService.getCurrentProfileDto(null).getId();
        TeamDto team = teamService.acceptingInvitation(ownerId, userId);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/teams/{teamId}/incomes")
    public ResponseEntity<List<IncomeDto>> getAllIncomesForTeam(
            @PathVariable("teamId") Long teamId) {
        List<IncomeDto> incomes = teamService.getAllIncomesForTeam(teamId);
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/teams/{teamId}/expenses")
    public ResponseEntity<List<ExpenseDto>> getAllExpensesForTeam(
            @PathVariable("teamId") Long teamId) {
        List<ExpenseDto> expenses = teamService.getAllExpensesForTeam(teamId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/teams/{teamId}/members")
    public ResponseEntity<List<ProfileDto>> members(
            @PathVariable("teamId") Long teamId) {
        List<ProfileDto> members = teamService.members(teamId);
        return ResponseEntity.ok(members);
    }
}