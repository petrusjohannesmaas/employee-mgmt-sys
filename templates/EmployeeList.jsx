import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/employees')
      .then(res => setEmployees(res.data));
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp._id}>{emp.name} - {emp.department}</li>
        ))}
      </ul>
    </div>
  );
}

