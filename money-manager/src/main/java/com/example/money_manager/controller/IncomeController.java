package com.example.money_manager.controller;

import com.example.money_manager.dtos.IncomeDto;
import com.example.money_manager.dtos.IncomeRequest;
import com.example.money_manager.service.IncomeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@AllArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeDto> createIncome(@RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<IncomeDto>> getCurrentMonthIncomes() {
        return ResponseEntity.ok(incomeService.getIncomeForCurrentUser());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}