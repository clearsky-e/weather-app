"use server";
import { WeatherData } from "../types/weather";
import {z} from "zod";

const weatherSchema = z.object({
    name: z.string(),
    main: z.object({
      temp: z.number(),
      humidity: z.number(),
      feels_like: z.number(),
    }),
    weather: z.array(
      z.object({
        main: z.string(),
        description: z.string(),
        icon: z.string(),
      }),
    ),
    wind: z.object({
      speed: z.number(),
    }),
  })


export async function getMyWeatherData(city: string): Promise<{
  data?: WeatherData,
  error?: string
}> {
  try {
    // Get the API key from the environment variables
    const apiKey = process.env.OPEN_WEATHER_API_KEY;

    if(!city.trim())
    {
        return {error: "City Name is Required"};
    }

    if (!apiKey) {
      throw new Error("API key is missing.");
    }

    // Fetch weather data from OpenWeather API
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    // Log the response status
    console.log("API Response Status:", res.status);

    if (!res.ok) {
      console.error("Failed to fetch weather data:", res.statusText);
      throw new Error(`City Not Found`);
    }

    // Parse the response data
    const rawdata = await res.json();
    const data = weatherSchema.parse(rawdata);
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError){
        return {error: "Invalid Weather Data recived"}
    }
    return{
        error: error instanceof Error? error.message:"Failed to Fetched the weather Data Now"
    }
  }
}
