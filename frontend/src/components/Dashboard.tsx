import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDashboard } from "../hooks/useDashboard";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { CityCard } from "./CityCard";
import { LogoutButton } from "../auth/LogoutButton";

type sortKey = "rank" | "temperature" | "cityName";

export const Dashboard = () => {
  const { user } = useAuth0();
  const { data, isLoading, error, refetch } = useDashboard();
  const [sortKey, setSortKey] = useState<sortKey>("rank");
  const [query, setQuery] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!data || data.cities.length === 0) {
    return (
      <p className="text-center text-slate-500 mt-16">No city data available</p>
    );
  }

  const filtered = data.cities
    .filter((c) => c.cityName.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "cityName") return a.cityName.localeCompare(b.cityName);
      if (sortKey === "temperature") return b.temperature - a.temperature;
      return a.rank - b.rank;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Weather Comfort Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.cityCount} cities · updated{" "}
            {new Date(data.generatedAt).toLocaleTimeString()}
            {user?.email ? ` · signed in as ${user.email}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={refetch}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <LogoutButton />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as sortKey)}
          className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="rank">Sort: Comfort rank</option>
          <option value="temperatureC">Sort: Temperature</option>
          <option value="cityName">Sort: City name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((city) => (
          <CityCard key={city.cityCode} city={city} />
        ))}
      </div>
    </div>
  );
};
