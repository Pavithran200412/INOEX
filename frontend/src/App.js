import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import { AppBar, Toolbar, Typography, Container, Button, Switch } from '@mui/material';

const API = 'http://localhost:8080/api';

function App(){
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(()=> fetchAll(), []);

  const fetchAll = async () => {
    const res = await axios.get(API + '/expenses');
    setExpenses(res.data || []);
    const sres = await axios.get(API + '/salary');
    if(sres.data && sres.data.length>0) setSalary(sres.data[0].amount);
  }

  const addExpense = async (e) => {
    await axios.post(API + '/expenses', e);
    fetchAll();
  }

  const deleteExpense = async (id) => {
    await axios.delete(API + '/expenses/' + id);
    fetchAll();
  }

  const setSal = async () => {
    const val = parseFloat(prompt('Enter salary', salary || 0));
    if(isNaN(val)) return;
    await axios.post(API + '/salary', { amount: val });
    setSalary(val);
  }

  const total = expenses.reduce((s,e)=> s + (Number(e.amount)||0), 0);
  const remaining = salary - total;

  return (
    <div style={{ background: dark? '#121212':'#fff', color: dark? '#fff':'#000', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Expense Tracker</Typography>
          <Switch checked={dark} onChange={()=>setDark(!dark)} />
        </Toolbar>
      </AppBar>
      <Container sx={{ py:3 }}>
        <Typography variant="h5">Salary: {salary} <Button onClick={setSal} variant="contained" size="small" sx={{ ml:2 }}>Set</Button></Typography>
        <Typography>Total expenses: {total} | Remaining: {remaining}</Typography>
        <hr/>
        <ExpenseForm onSave={addExpense} />
        <hr/>
        <h3>Expenses</h3>
        <ul>
          {expenses.map(e=> <li key={e.id}>{e.date} — {e.category} — {e.amount} <Button size="small" onClick={()=>deleteExpense(e.id)}>Delete</Button></li>)}
        </ul>
        <p>Charts (add Recharts components as needed) — currently placeholders.</p>
      </Container>
    </div>
  );
}

export default App;
