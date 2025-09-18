import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function ExpenseForm({ onSave, editingExpense }) {
  const [form, setForm] = useState({ date: "", category: "", amount: "" });

  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.category || !form.amount) return;
    onSave(form);
    setForm({ date: "", category: "", amount: "" });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        type="date"
        label="Date"
        InputLabelProps={{ shrink: true }}
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      <TextField
        label="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      />
      <TextField
        type="number"
        label="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || "" })}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {form.id ? "Update" : "Add"}
      </Button>
    </Box>
  );
}
