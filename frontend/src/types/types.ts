export interface ComfortBreakdown {
  temperatureScore: number;
  humidityScore: number;
  windScore: number;
  cloudinessScore: number;
}

export interface CityComfortResult {
  cityCode: string;
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  cloudiness: number;
  comfortIndex: number;
  parameters: ComfortBreakdown;
  rank: number;
  observedAt: string;
}

export interface DashboardResponse {
  generatedAt: string;
  cityCount: number;
  cities: CityComfortResult[];
}
