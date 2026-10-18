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
app.use(express.json());

app.use(express.json());

connectDB();

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