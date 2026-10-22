import {
    getWeatherByFarmService,
    getForecastByFarmService,
    getWeatherAlertsByFarmService
} from '../services/weatherService.js';

export const getWeatherByFarm=async (req, res)=>
{
    try {
    const {farmId}=req.params;
    const weatherDetail=await getWeatherByFarmService(
        farmId,
        req.user.id

    );

    res.status(200).json({
        message:"Weather Detail is Returned Successfully",
        weatherDetail
    })
        
    }
     catch (error) {

        console.error('Getting Weather Error', error);
        res.status(400).json({
            message:error.message
        });
        
    }

};



export const getForecastByFarm=async (req, res)=>
{
    try {
         const {farmId}=req.params;
    const forecastDetail=await getForecastByFarmService(
        farmId,
        req.user.id

    );

    res.status(200).json({
        message:"Weather Forecast Detail is Returned Successfully",
        forecastDetail
    });
        
    } 
    catch (error) {

         console.error('Getting weather Forecast Error', error);
        res.status(400).json({
            message:error.message
        });
        
        
    }
    
};



export const getWeatherAlertsByFarm=async (req, res)=>
{

try {

     const {farmId}=req.params;
    const alertsDetail=await getWeatherAlertsByFarmService(
        farmId,
        req.user.id

    );

    res.status(200).json({
        message:"Weather Alerts Detail is Returned Successfully",
        alertsDetail
    })
    
} 
catch (error) {

     console.error('Getting Weather  Alerts Error', error);
        res.status(400).json({
            message:error.message
        });
        
    
}
    
}