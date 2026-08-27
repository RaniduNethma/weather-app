import { ComfortIndexParameters } from "../types/type";

// comfort impact weights, temperature 50%, humidity 30%, wind 20%
const weights = {
  temperature: 0.5,
  humidity: 0.3,
  wind: 0.2,
} as const;

const clamp = (value: number, min = 0, max = 100): number => {
  return Math.min(max, Math.max(min, value));
};

// ideal 21 celsius score drops 4 points per degree
const temperatureScore = (tempC: number): number => {
  const idealC = 21;
  const penaltyPerDegree = 4;
  return clamp(100 - Math.abs(tempC - idealC) * penaltyPerDegree);
};

// ideal 50% relative humidity. score drops 2 points per %
const humidityScore = (humidityPct: number): number => {
  const idealPct = 50;
  const penaltyPerDegree = 2;
  return clamp(100 - Math.abs(humidityPct - idealPct) * penaltyPerDegree);
};

// calm air <= 3 m/s is treated as fully comfortable
const windScore = (windSpeedMS: number): number => {
  const threshold = 3;
  const penaltyPerMS = 8;
  const excess = Math.max(0, windSpeedMS - threshold);
  return clamp(100 - excess * penaltyPerMS);
};

export const computeComfortIndex = (input: {
  temperature: number;
  humidity: number;
  windSpeed: number;
}): { score: number; parameters: ComfortIndexParameters } => {
  const parameters: ComfortIndexParameters = {
    temperatureScore: Number(temperatureScore(input.temperature).toFixed(2)),
    humidityScore: Number(humidityScore(input.humidity).toFixed(2)),
    windScore: Number(windScore(input.windSpeed).toFixed(2)),
  };

  const rawScore =
    parameters.temperatureScore * weights.temperature +
    parameters.humidityScore * weights.humidity +
    parameters.windScore * weights.wind;

  return { score: Number(clamp(rawScore).toFixed(2)), parameters };
};
