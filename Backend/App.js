import express from 'express';
import { authRouter } from './src/routes/authRoutes.js';
import {farmRouter} from './src/routes/farmRoutes.js';
import {fieldRouter} from './src/routes/fieldRoutes.js';
import {cropRouter  } from './src/routes/cropRoutes.js';
import { healthRouter } from "./src/routes/healthRoutes.js";
import { riskRouter } from "./src/routes/riskRoutes.js";
import {weatherRouter} from  './src/routes/weatherRoutes.js';



const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('That is the first Architecture of the AgriWise backend');
});

app.use('/api/auth', authRouter);
app.use('/api/farm', farmRouter);
app.use('/api/field', fieldRouter);
app.use('/api/crop', cropRouter);
app.use('/api/crop-health', healthRouter);
app.use('/api/crop-risk',riskRouter);
app.use('/api/weather', weatherRouter);

export default app;