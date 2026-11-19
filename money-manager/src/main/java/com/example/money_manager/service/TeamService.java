package com.example.money_manager.service;

import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.TeamDto;

import java.util.List;

public interface TeamService {
    void sendInvitationToMember(Long ownerId, Long profileId);

    TeamDto acceptingInvitation(Long ownerId, Long userId);

    List<IncomeDto> getAllIncomesForTeam(Long teamId);

    List<ExpenseDto> getAllExpensesForTeam(Long teamId);

    List<ProfileDto> members(Long teamId);
}