package com.example.money_manager.mapper;

import com.example.money_manager.domain.Expense;
import com.example.money_manager.domain.Income;
import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.ExpenseRequest;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.IncomeRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IncomeMapper {

    Income toEntity(IncomeRequest expenseRequest);

    IncomeDto toDto(Income expense);
}
