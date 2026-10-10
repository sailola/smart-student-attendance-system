const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');

const app = express();
app.use(express.json());
app.use(cors());

// Routes registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));