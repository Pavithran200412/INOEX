package com.example.demo.controller;

import com.example.demo.model.Salary;
import com.example.demo.repository.SalaryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/salary")
public class SalaryController {
    private final SalaryRepository repo;
    public SalaryController(SalaryRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Salary> getAll() { return repo.findAll(); }

    @PostMapping
    public Salary setSalary(@RequestBody Salary s) { return repo.save(s); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
