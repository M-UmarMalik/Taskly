import 'dotenv/config'
import express from 'express';
import authRoute from './src/routes/authroute.js';
import connectDB from './src/config/db.js'
import cors from 'cors';
import taskRoutes from "./src/routes/taskRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:5173' || process.env.API_URI,
  credentials: true,
};

connectDB();
app.use(express.json());
app.use(cors(corsOptions)); 
app.use('/api', authRoute);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello, your Express server is running!");
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
