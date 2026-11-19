package com.example.money_manager.controller;

import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.FilterDto;
import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.service.ExpenseService;
import com.example.money_manager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/filter")
@RequiredArgsConstructor
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<?> filter(@RequestBody FilterDto filterDto) {

        LocalDate startDate = filterDto.getStart();

        LocalDate endDate = filterDto.getEnd() != null
                ? filterDto.getEnd()
                : LocalDate.now();

        String keyword = filterDto.getName() != null
                ? filterDto.getName()
                : "";

        String sortField = filterDto.getSortField() != null
                ? filterDto.getSortField()
                : "date";

        Sort.Direction direction = "desc".equalsIgnoreCase(filterDto.getSortOrder())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Sort sort = Sort.by(direction, sortField);

        if ("income".equalsIgnoreCase(filterDto.getType())) {

            List<IncomeDto> incomes =
                    incomeService.getFilterInformation(startDate, endDate, keyword, sort);

            return ResponseEntity.ok(incomes);

        } else if ("expense".equalsIgnoreCase(filterDto.getType())) {

            List<ExpenseDto> expenses =
                    expenseService.getFilterInformation(startDate, endDate, keyword, sort);

            return ResponseEntity.ok(expenses);

        } else {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid type. Must be 'income' or 'expense'");
        }
    }
}