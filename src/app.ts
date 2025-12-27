import express from 'express';
import { chatRoutes } from './routes';

const app = express();

app.use(express.json());

app.use('/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;