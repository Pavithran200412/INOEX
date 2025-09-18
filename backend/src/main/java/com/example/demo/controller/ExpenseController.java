package com.example.demo.controller;

import com.example.demo.model.Expense;
import com.example.demo.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository repo;
    public ExpenseController(ExpenseRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Expense> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Optional<Expense> one(@PathVariable Long id) { return repo.findById(id); }

    @PostMapping
    public Expense create(@RequestBody Expense e) { return repo.save(e); }

    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @RequestBody Expense e) {
        e.setId(id);
        return repo.save(e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
