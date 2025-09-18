import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Grid,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';

const API = 'http://localhost:8080/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(0);
  const [dark, setDark] = useState(false);
  const [editing, setEditing] = useState(null); // <--- editing state

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get(API + '/expenses');
      setExpenses(res.data || []);
      const sres = await axios.get(API + '/salary');
      if (sres.data && sres.data.length > 0) setSalary(sres.data[0].amount);
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  // unified save: add or update depending on `editing`
  const saveExpense = async (payload) => {
    try {
      if (editing) {
        // update existing
        await axios.put(`${API}/expenses/${editing.id}`, {
          category: payload.category,
          amount: Number(payload.amount),
          date: payload.date
        });
        setEditing(null);
      } else {
        // create new
        await axios.post(API + '/expenses', {
          category: payload.category,
          amount: Number(payload.amount),
          date: payload.date
        });
      }
      await fetchAll();
    } catch (err) {
      console.error('Save error', err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(API + '/expenses/' + id);
      // if we were editing that deleted item, clear edit
      if (editing && editing.id === id) setEditing(null);
      fetchAll();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const setSal = async () => {
    const val = parseFloat(prompt('Enter salary', salary || 0));
    if (isNaN(val)) return;
    try {
      await axios.post(API + '/salary', { amount: val });
      setSalary(val);
    } catch (err) {
      console.error('Salary set error', err);
    }
  };

  // Totals
  const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const remaining = salary - total;

  // Chart Data
  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
      acc[e.category].value += Number(e.amount);
      return acc;
    }, {})
  );

  const monthlyData = Object.values(
    expenses.reduce((acc, e) => {
      const month = e.date?.slice(0, 7) || 'Unknown'; // YYYY-MM
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += Number(e.amount);
      return acc;
    }, {})
  ).sort((a, b) => a.month.localeCompare(b.month));

  const barData = [
    { name: 'Salary', value: salary },
    { name: 'Expenses', value: total },
    { name: 'Remaining', value: remaining },
  ];

  // Helpers
  const categoryIcons = {
    Food: "🍔",
    Transport: "🚗",
    Rent: "🏠",
    Shopping: "🛍️",
    Other: "💡"
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <div style={{ background: dark ? '#121212' : '#fff', color: dark ? '#fff' : '#000', minHeight: '100vh' }}>
        <Toolbar>
          <Typography variant="h3" sx={{ flexGrow: 1 }}>Expense Tracker</Typography>
        </Toolbar>

      <Container sx={{ py: 3 }}>
        <Typography variant="h5">
          Salary: {formatCurrency(salary)}{' '}
          <Button onClick={setSal} variant="contained" size="small" sx={{ ml: 2 }}>Set</Button>
        </Typography>
        <Typography>
          Total expenses: {formatCurrency(total)} | Remaining: {formatCurrency(remaining)}
        </Typography>

        <hr />

        {/* Pass editing & cancel to form */}
        <ExpenseForm
          onSave={saveExpense}
          expenseToEdit={editing}
          onCancel={() => setEditing(null)}
        />

        <hr />

        <h3>Expenses</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{formatDate(e.date)}</TableCell>
                  <TableCell>{categoryIcons[e.category] || "📌"} {e.category}</TableCell>
                  <TableCell>{formatCurrency(e.amount)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => setEditing(e)} // <--- opens form in edit mode
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => {
                        // confirm deletion
                        if (window.confirm('Delete this expense?')) deleteExpense(e.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Category Breakdown</Typography>
              <PieChart width={300} height={250}>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Monthly Trend</Typography>
              <LineChart width={300} height={250} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Salary vs Expenses</Typography>
              <BarChart width={300} height={250} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </div>
  );
}

export default App;
