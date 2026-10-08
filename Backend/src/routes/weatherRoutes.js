import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import {
    getWeatherByFarm,
    getForecastByFarm,
    getWeatherAlertsByFarm
} from '../controllers/weatherController.js';


const weatherRouter=express.Router();

weatherRouter.use(authenticateToken);
weatherRouter.use(authorizeRole(["farmer"]));

weatherRouter.get('/farm/:farmId', getWeatherByFarm);
weatherRouter.get('/farm/:farmId/forecast', getForecastByFarm);
weatherRouter.get('/farm/:farmId/alerts', getWeatherAlertsByFarm);

export {weatherRouter};