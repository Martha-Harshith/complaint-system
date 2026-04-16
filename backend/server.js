require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'https://complaint-system-sute.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));app.use(express.json());

// Routes
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

// Health Check
app.get('/', (req, res) => res.send('Complaint System API Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
