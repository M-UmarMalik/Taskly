import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoute from './src/routes/authroute.js';
import connectDB from './src/config/db.js';
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
app.options('*', cors(corsOptions)); // preflight

app.use(express.json());

// Har request se pehle DB connect ho (serverless ke liye zaroori)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api', authRoute);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello, your Express server is running!');
});

// Sirf local par listen karo
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;