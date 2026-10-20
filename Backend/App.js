import express from 'express';
import cors from 'cors';
import { authRouter } from './src/routes/authRoutes.js';
import {farmRouter} from './src/routes/farmRoutes.js';
import {fieldRouter} from './src/routes/fieldRoutes.js';
import {cropRouter  } from './src/routes/cropRoutes.js';
import { healthRouter } from "./src/routes/healthRoutes.js";
import { riskRouter } from "./src/routes/riskRoutes.js";
import {weatherRouter} from  './src/routes/weatherRoutes.js';
import { economicsRouter } from "./src/routes/economicsRoutes.js";
import { marketPriceRouter } from "./src/routes/marketPriceRoutes.js";
import { agriculturalResourceRouter } from "./src/routes/agriculturalResourceRoutes.js";
import { adminDashboardRouter } from "./src/routes/adminDashboardRoutes.js";
import { aiRouter } from "./src/routes/aiRoutes.js";



const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean);

// CORS must be registered before the API routes.
app.use(
  cors({
    origin: (origin, callback) => {
      // Permit requests without an Origin header, such as Postman.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Other browser origins will not receive CORS permission.
      return callback(null, false);
    },
  })
);

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
app.use("/api/economics", economicsRouter);
app.use("/api/market-prices", marketPriceRouter);
app.use("/api/resources", agriculturalResourceRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);
app.use("/api/ai", aiRouter);

export default app;