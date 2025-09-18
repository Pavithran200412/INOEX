import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import ExpenseForm from "./ExpenseForm";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filter, setFilter] = useState({ category: "", fromDate: "", toDate: "" });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:8080/api/expenses");
    setExpenses(res.data);
  };

  const saveExpense = async (expense) => {
    if (expense.id) {
      await axios.put(`http://localhost:8080/api/expenses/${expense.id}`, expense);
    } else {
      await axios.post("http://localhost:8080/api/expenses", expense);
    }
    fetchExpenses();
    setEditingExpense(null);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:8080/api/expenses/${id}`);
    fetchExpenses();
  };

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const from = filter.fromDate ? new Date(filter.fromDate) : null;
    const to = filter.toDate ? new Date(filter.toDate) : null;
    return (
      (!filter.category || e.category.toLowerCase().includes(filter.category.toLowerCase())) &&
      (!from || date >= from) &&
      (!to || date <= to)
    );
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categorySummary = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const categoryData = Object.keys(categorySummary).map((key) => ({
    category: key,
    total: categorySummary[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AB47BC", "#26A69A"];

  const lineData = filteredExpenses.map((e) => ({
    date: e.date,
    amount: e.amount,
  }));

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Expense Tracker
      </Typography>

      {/* Expense Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <ExpenseForm onSave={saveExpense} editingExpense={editingExpense} />
      </Paper>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          type="date"
          label="From Date"
          InputLabelProps={{ shrink: true }}
          value={filter.fromDate}
          onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
        />
        <TextField
          type="date"
          label="To Date"
          InputLabelProps={{ shrink: true }}
          value={filter.toDate}
          onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
        />
        <TextField
          label="Category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        />
        <Button variant="outlined" onClick={() => setFilter({ category: "", fromDate: "", toDate: "" })}>
          Clear
        </Button>
      </Box>

      {/* Total Summary */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Total Spent: ${total.toFixed(2)}
      </Typography>

      {/* Expense List */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Expenses</Typography>
        {filteredExpenses.map((e) => (
          <Box key={e.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography>
              {e.date} - {e.category}: ${e.amount}
            </Typography>
            <Box>
              <IconButton color="primary" onClick={() => setEditingExpense(e)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => deleteExpense(e.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Category Summary Table */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Category-wise Summary
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Total Spent ($)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData.map((c) => (
              <TableRow key={c.category}>
                <TableCell>{c.category}</TableCell>
                <TableCell>{c.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Expenses by Category</Typography>
          <PieChart width={300} height={300}>
            <Pie data={categoryData} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100}>
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6">Monthly Trend</Typography>
          <LineChart width={400} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </Grid>
      </Grid>
    </Container>
  );
}
