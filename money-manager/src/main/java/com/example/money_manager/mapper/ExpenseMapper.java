package com.example.money_manager.mapper;

import com.example.money_manager.domain.Expense;
import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.ExpenseRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {

    Expense toEntity(ExpenseRequest expenseRequest);

    ExpenseDto toDto(Expense expense);
}
