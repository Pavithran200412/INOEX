import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Grid, Paper } from '@mui/material';

const categories = ["Food", "Transport", "Rent", "Shopping", "Other"];

export default function ExpenseForm({ onSave, expenseToEdit, onCancel }) {
  // local state for the form fields
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  // when expenseToEdit changes, populate the form
  useEffect(() => {
    if (expenseToEdit) {
      setCategory(expenseToEdit.category || '');
      setAmount(expenseToEdit.amount != null ? expenseToEdit.amount : '');
      setDate(expenseToEdit.date || '');
    } else {
      // clear form when not editing
      setCategory('');
      setAmount('');
      setDate('');
    }
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!category || !amount || !date) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      category,
      amount: parseFloat(amount),
      date
    };

    onSave(payload);

    // clear form for new entry
    setCategory('');
    setAmount('');
    setDate('');
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" color="primary">
              {expenseToEdit ? 'Update' : 'Add'}
            </Button>

            {expenseToEdit ? (
              <Button variant="outlined" color="secondary" onClick={() => onCancel()}>
                Cancel
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
