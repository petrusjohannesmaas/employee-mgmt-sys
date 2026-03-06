import { useState } from 'react';
import axios from 'axios';

export default function AddEmployee() {
  const [form, setForm] = useState({ eID: '', name: '', department: '', role: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/employees', form);
    alert('Employee added!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Employee ID" onChange={e => setForm({ ...form, eID: e.target.value })} />
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Department" onChange={e => setForm({ ...form, department: e.target.value })} />
      <input placeholder="Role" onChange={e => setForm({ ...form, role: e.target.value })} />
      <button type="submit">Add Employee</button>
    </form>
  );
}

