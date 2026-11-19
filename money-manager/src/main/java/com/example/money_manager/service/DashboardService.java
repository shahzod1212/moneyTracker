package com.example.money_manager.service;

import com.example.money_manager.domain.Expense;
import com.example.money_manager.domain.Income;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.domain.Team;
import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.RecentTransactionDto;
import com.example.money_manager.mapper.ExpenseMapper;
import com.example.money_manager.mapper.IncomeMapper;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.repository.IncomeRepository;
import com.example.money_manager.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProfileService profileService;
    private final ExpenseService expenseService;
    private final IncomeService incomeService;
    private final TeamRepository teamRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeMapper incomeMapper;
    private final ExpenseMapper expenseMapper;

    public Map<String, Object> dashboardInformation() {

        Profile profile = profileService.getCurrentProfile();

        List<IncomeDto> latestIncome = incomeService.getTop5Income();
        List<ExpenseDto> latestExpense = expenseService.getTop5Expense();

        // Merge income + expense into one timeline list
        List<RecentTransactionDto> recentTransactions =
                Stream.concat(
                                latestIncome.stream().map(income ->
                                        RecentTransactionDto.builder()
                                                .id(income.getId())
                                                .amount(income.getAmount())
                                                .profileId(profile.getId())
                                                .date(income.getDate())
                                                .createdAt(income.getCreatedAt())
                                                .updatedAt(income.getUpdatedAt())
                                                .name(income.getName())
                                                .type("income")
                                                .icon(income.getIcon())
                                                .build()
                                ),
                                latestExpense.stream().map(expense ->
                                        RecentTransactionDto.builder()
                                                .id(expense.getId())
                                                .amount(expense.getAmount())
                                                .profileId(profile.getId())
                                                .date(expense.getDate())
                                                .createdAt(expense.getCreatedAt())
                                                .updatedAt(expense.getUpdatedAt())
                                                .name(expense.getName())
                                                .type("expense")
                                                .icon(expense.getIcon())
                                                .build()
                                )
                        )
                        .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                        .toList();

        BigDecimal totalIncome = incomeService.getTotalAmount() != null
                ? incomeService.getTotalAmount()
                : BigDecimal.ZERO;

        BigDecimal totalExpense = expenseService.getTotalAmount() != null
                ? expenseService.getTotalAmount()
                : BigDecimal.ZERO;

        BigDecimal totalBalance = totalIncome.subtract(totalExpense);

        Map<String, Object> returnValue = new HashMap<>();
        returnValue.put("totalBalance", totalBalance);
        returnValue.put("totalIncome", totalIncome);
        returnValue.put("totalExpense", totalExpense);
        returnValue.put("recentIncome", latestIncome);
        returnValue.put("recentExpense", latestExpense);
        returnValue.put("recentTransactions", recentTransactions);

        return returnValue;
    }

    public Map<String, Object> teamDashboardInformation(Long teamId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        List<Profile> teamProfiles = new ArrayList<>(team.getMembers());
        if (team.getOwner() != null && teamProfiles.stream()
                .noneMatch(p -> p.getId().equals(team.getOwner().getId()))) {
            teamProfiles.add(team.getOwner());
        }

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        List<IncomeDto> allRecentIncome = new ArrayList<>();
        List<ExpenseDto> allRecentExpense = new ArrayList<>();
        List<RecentTransactionDto> recentTransactions = new ArrayList<>();

        for (Profile profile : teamProfiles) {
            Long profileId = profile.getId();

            BigDecimal profileIncomeTotal = incomeRepository.findTotalIncomeByProfileId(profileId);
            BigDecimal profileExpenseTotal = expenseRepository.findTotalExpenseByProfileId(profileId);

            totalIncome = totalIncome.add(profileIncomeTotal != null ? profileIncomeTotal : BigDecimal.ZERO);
            totalExpense = totalExpense.add(profileExpenseTotal != null ? profileExpenseTotal : BigDecimal.ZERO);

            List<Income> incomes = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profileId);
            List<Expense> expenses = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profileId);

            List<IncomeDto> incomeDtos = incomes.stream().map(incomeMapper::toDto).toList();
            List<ExpenseDto> expenseDtos = expenses.stream().map(expenseMapper::toDto).toList();

            allRecentIncome.addAll(incomeDtos);
            allRecentExpense.addAll(expenseDtos);

            incomeDtos.forEach(income -> recentTransactions.add(
                    RecentTransactionDto.builder()
                            .id(income.getId())
                            .amount(income.getAmount())
                            .profileId(profileId)
                            .date(income.getDate())
                            .createdAt(income.getCreatedAt())
                            .updatedAt(income.getUpdatedAt())
                            .name(income.getName())
                            .type("income")
                            .icon(income.getIcon())
                            .build()
            ));

            expenseDtos.forEach(expense -> recentTransactions.add(
                    RecentTransactionDto.builder()
                            .id(expense.getId())
                            .amount(expense.getAmount())
                            .profileId(profileId)
                            .date(expense.getDate())
                            .createdAt(expense.getCreatedAt())
                            .updatedAt(expense.getUpdatedAt())
                            .name(expense.getName())
                            .type("expense")
                            .icon(expense.getIcon())
                            .build()
            ));
        }

        List<RecentTransactionDto> sortedRecentTransactions = recentTransactions.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(5)
                .toList();

        List<IncomeDto> sortedRecentIncome = allRecentIncome.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(5)
                .toList();

        List<ExpenseDto> sortedRecentExpense = allRecentExpense.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(5)
                .toList();

        BigDecimal totalBalance = totalIncome.subtract(totalExpense);

        Map<String, Object> returnValue = new HashMap<>();
        returnValue.put("totalBalance", totalBalance);
        returnValue.put("totalIncome", totalIncome);
        returnValue.put("totalExpense", totalExpense);
        returnValue.put("recentIncome", sortedRecentIncome);
        returnValue.put("recentExpense", sortedRecentExpense);
        returnValue.put("recentTransactions", sortedRecentTransactions);

        return returnValue;
    }
}