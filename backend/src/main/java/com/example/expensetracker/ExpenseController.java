package com.example.expensetracker;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {
    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return repository.save(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        return repository.findById(id)
                .map(expense -> {
                    expense.setTitle(updatedExpense.getTitle());
                    expense.setAmount(updatedExpense.getAmount());
                    expense.setCategory(updatedExpense.getCategory());
                    expense.setDate(updatedExpense.getDate());
                    return repository.save(expense);
                })
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
