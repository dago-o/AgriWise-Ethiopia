import express from 'express';
import { authRouter } from './src/routes/authRoutes.js';
import {farmRouter} from './src/routes/farmRoutes.js';
import {fieldRouter} from './src/routes/fieldRoutes.js';
import {cropRouter  } from './src/routes/cropRoutes.js';


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('That is the first Architecture of the AgriWise backend');
});

app.use('/api/auth', authRouter);
app.use('/api/farm', farmRouter);
app.use('/api/field', fieldRouter);
app.use('/api/crop', cropRouter);

export default app;