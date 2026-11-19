package com.example.money_manager.service.Impl;

import com.example.money_manager.domain.Category;
import com.example.money_manager.domain.Expense;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.ExpenseRequest;
import com.example.money_manager.mapper.ExpenseMapper;
import com.example.money_manager.repository.CategoryRepository;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.service.ExpenseService;
import com.example.money_manager.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {
    private ProfileService profileService;
    private CategoryRepository categoryRepository;
    private ExpenseRepository expenseRepository;
    private ExpenseMapper expenseMapper;

    @Override
    @Transactional
    public ExpenseDto create(ExpenseRequest expenseRequest) {
        Profile profile = profileService.getCurrentProfile();
        Category category = categoryRepository.findById(expenseRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category does not exist"));

        if (category.getBudget() != null) {
            BigDecimal remainingBudget = category.getBudget().subtract(category.getTotalSpending());
            if (remainingBudget.compareTo(expenseRequest.getAmount()) < 0) {
                throw new RuntimeException("Cannot add expense, budget is limited");
            }
        }

        category.setTotalSpending(category.getTotalSpending().add(expenseRequest.getAmount()));
        categoryRepository.save(category);

        Expense expense = expenseMapper.toEntity(expenseRequest);
        expense.setProfile(profile);
        expense.setCategory(category);
        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toDto(saved);
    }

    @Override
    public List<ExpenseDto> getExpenseForCurrentUser() {
        Profile profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseDto> list = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), start, end)
                .stream()
                .map(expenseMapper::toDto)
                .toList();
        return list;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Profile profile = profileService.getCurrentProfile();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Not authorized to delete this expense");
        }

        Category category = expense.getCategory();
        if (category != null) {
            category.setTotalSpending(category.getTotalSpending().subtract(expense.getAmount()));
            categoryRepository.save(category);
        }

        expenseRepository.delete(expense);
    }

    @Override
    public List<ExpenseDto> getTop5Expense() {
        Profile profile = profileService.getCurrentProfile();
        List<ExpenseDto> list = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId())
                .stream()
                .map(expenseMapper::toDto)
                .toList();
        return list;
    }

    @Override
    public BigDecimal getTotalAmount() {
        Profile profile = profileService.getCurrentProfile();
        BigDecimal list = expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return list;
    }

    @Override
    public List<ExpenseDto> getFilterInformation(LocalDate start, LocalDate end, String name, Sort sort) {
        Profile profile = profileService.getCurrentProfile();
        List<ExpenseDto> list = expenseRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(),
                        start, end, name, sort).stream().map(expenseMapper::toDto)
                .toList();
        return list;
    }

    @Override
    public List<ExpenseDto> getExpenseForUser(LocalDate date) {
        Profile profile = profileService.getCurrentProfile();
        List<ExpenseDto> list = expenseRepository.findByProfileIdAndDate(profile.getId(), date)
                .stream().map(expenseMapper::toDto)
                .toList();
        return list;
    }
}