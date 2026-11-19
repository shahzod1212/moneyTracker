package com.example.money_manager.service;

import com.example.money_manager.domain.Expense;
import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.ExpenseRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

    ExpenseDto create(ExpenseRequest expenseRequest);

    List<ExpenseDto> getExpenseForCurrentUser();

    void delete(Long id);

    List<ExpenseDto> getTop5Expense();
    BigDecimal getTotalAmount();

    List<ExpenseDto> getFilterInformation(LocalDate start, LocalDate end, String name, Sort sort);

    List<ExpenseDto> getExpenseForUser(LocalDate date);
}
