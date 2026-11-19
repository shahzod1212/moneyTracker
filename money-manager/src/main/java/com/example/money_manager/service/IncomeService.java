package com.example.money_manager.service;

import com.example.money_manager.domain.Expense;
import com.example.money_manager.domain.Income;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.IncomeRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeService {

    IncomeDto create(IncomeRequest incomeRequest);

    List<IncomeDto> getIncomeForCurrentUser();

    void delete(Long id);

    List<IncomeDto> getTop5Income();

    BigDecimal getTotalAmount();

    List<IncomeDto> getFilterInformation(LocalDate start, LocalDate end, String name, Sort sort);
}