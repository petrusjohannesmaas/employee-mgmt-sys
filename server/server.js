import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Employee model
const employeeSchema = new mongoose.Schema({
  eID: { type: String, unique: true },
  name: String,
  department: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes
app.post('/employees', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/employees', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

app.delete('/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee removed successfully' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
