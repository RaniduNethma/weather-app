import { CityComfortResult } from "../types/types";

function comfortColor(score: number): string {
  if (score >= 80) return "bg-comfort-great";
  if (score >= 60) return "bg-comfort-good";
  if (score >= 40) return "bg-comfort-fair";
  if (score >= 20) return "bg-comfort-poor";
  return "bg-comfort-bad";
}

function comfortLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  if (score >= 20) return "Poor";
  return "Uncomfortable";
}

interface CityCardProps {
  city: CityComfortResult;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              #{city.rank}
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {city.cityName}
            </h3>
          </div>
        </div>
        <div
          className={`${comfortColor(
            city.comfortIndex,
          )} text-white text-sm font-bold rounded-full h-14 w-14 flex items-center justify-center shrink-0`}
        >
          {Math.round(city.comfortIndex)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Stat label="Temperature" value={`${city.temperature}°C`} />
        <Stat label="Humidity" value={`${city.humidity}%`} />
        <Stat label="Wind speed" value={`${city.windSpeed}ms`} />
        <Stat label="Cloudiness" value={`${city.cloudiness}%`} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs text-slate-400">
          Comfort: {comfortLabel(city.comfortIndex)}
        </span>
        <span className="text-xs text-slate-400">
          {new Date(city.observedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="text-slate-800 dark:text-slate-100 font-medium">{value}</p>
    </div>
  );
}
