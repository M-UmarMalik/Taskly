import 'dotenv/config';
import express from 'express';
import authRoute from './src/routes/authroute.js';
import connectDB from './src/config/db.js';
import cors from 'cors';
import taskRoutes from './src/routes/taskRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://taskly-probzzz.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', authRoute);
app.use('/api/tasks', taskRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Hello, your Express server is running!');
});

// Start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});