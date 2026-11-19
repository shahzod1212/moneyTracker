package com.example.money_manager.controller;

import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.ExpenseRequest;
import com.example.money_manager.service.ExpenseService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@AllArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getCurrentMonthExpenses() {
        return ResponseEntity.ok(expenseService.getExpenseForCurrentUser());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}