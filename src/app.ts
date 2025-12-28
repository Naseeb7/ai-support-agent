import express from 'express';
import cors from 'cors';
import { chatRoutes } from './routes';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', // Use environment variable or default
  credentials: false // Do not allow credentials
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;