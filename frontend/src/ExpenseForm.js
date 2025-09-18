import React, {useState, useEffect} from 'react';
import { TextField, Button, MenuItem } from '@mui/material';

const categories = ['Food','Transport','Rent','Shopping','Other'];

export default function ExpenseForm({onSave, edit}) {
  const [category, setCategory] = useState(edit?.category || '');
  const [amount, setAmount] = useState(edit?.amount || '');
  const [date, setDate] = useState(edit?.date || '');

  useEffect(()=> {
    setCategory(edit?.category || '');
    setAmount(edit?.amount || '');
    setDate(edit?.date || '');
  }, [edit]);

  const submit = (e) => {
    e.preventDefault();
    if(!category || !amount || !date) return;
    onSave({ category, amount: parseFloat(amount), date });
    setCategory(''); setAmount(''); setDate('');
  }

  return (
    <form onSubmit={submit} style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
      <TextField select label="Category" value={category} onChange={e=>setCategory(e.target.value)} required>
        {categories.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <TextField label="Amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)} required />
      <TextField label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} InputLabelProps={{ shrink: true }} required />
      <Button variant="contained" type="submit">Save</Button>
    </form>
  );
}
