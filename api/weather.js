import axios from "axios";
import { apiKey } from "../constants";

/**
 * The code defines two functions that generate API endpoints for weather forecasts and location
 * searches using the WeatherAPI.
 */
const forecastEndpoint = params=> `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = params=> `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
/**
 * The code exports two functions, `fetchWeatherForecast` and `fetchLocations`, which make API calls to
 * retrieve weather forecasts and locations respectively.
 * @param endpoint - The `endpoint` parameter is the URL of the API endpoint that you want to make a
 * request to. It could be the URL of a weather forecast API or a locations API, depending on the
 * function you are calling.
 * @returns The `fetchWeatherForecast` function and `fetchLocations` function are returning the result
 * of the `apiCall` function.
 */
const apiCall = async (endpoint)=>{
    const options = {
        method: 'GET',
        url: endpoint,
    };

      try{
        const response = await axios.request(options);
        return response.data;
      }catch(error){
        console.log('error: ',error);
        return {};
    }
}

export const fetchWeatherForecast = params=>{
    let forecastUrl = forecastEndpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = params=>{
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}