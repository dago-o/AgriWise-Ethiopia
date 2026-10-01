import express from 'express';
import { authRouter } from './src/routes/authRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('That is the first Architecture of the AgriWise backend');
});

app.use('/api/auth', authRouter);

export default app;