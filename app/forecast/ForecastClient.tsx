"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import Chatbot from "@/components/Chatbot";

interface BloomData {
  date: string;
  intensity: number;
  isForecast?: boolean;
}

export default function ForecastClient() {
  const [data, setData] = useState<BloomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndForecast = async () => {
      try {
        const response = await fetch("/api/forecast", {
          method: "POST",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch historical data");
        }

        const result = await response.json();
        const historicalData: BloomData[] = result.data;

        if (historicalData.length === 0) {
          setError("No historical data available to generate a forecast.");
          setLoading(false);
          return;
        }

        const forecastMonths = 6;
        const lastDate = new Date(historicalData[historicalData.length - 1].date);
        const forecastData: BloomData[] = [];

        let totalChange = 0;
        for (let i = 1; i < historicalData.length; i++) {
          totalChange += historicalData[i].intensity - historicalData[i - 1].intensity;
        }
        const averageChange =
          historicalData.length > 1 ? totalChange / (historicalData.length - 1) : 0;

        for (let i = 1; i <= forecastMonths; i++) {
          const nextDate = new Date(lastDate);
          nextDate.setMonth(lastDate.getMonth() + i);
          const predictedIntensity = Math.max(
            0,
            Math.min(
              100,
              historicalData[historicalData.length - 1].intensity + averageChange * i
            )
          );

          forecastData.push({
            date: nextDate.toISOString().split("T")[0],
            intensity: predictedIntensity,
            isForecast: true,
          });
        }

        const combinedData = [...historicalData, ...forecastData];
        setData(combinedData);
      } catch (e: unknown) {
        let errorMessage = "Failed to load forecast data";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndForecast();
  }, []);

  if (loading) {
    return <div className="text-center text-slate-300">Loading forecast, hang on...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>;
  }

  const dateFormatter = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-8">
      <Card className="p-4 sm:p-6 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Bloom Intensity Forecast</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={dateFormatter} />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#475569",
              }}
formatter={(value: number | string, _name: string, payload?: { value?: number | string; name?: "Predicted Intensity" | "Historical Intensity" | undefined; payload?: BloomData; color?: string; }) => {
                const isForecast = Boolean(payload && payload.payload?.isForecast);

                const numeric = typeof value === "number" ? value : Number(value ?? NaN);
                const formatted = Number.isFinite(numeric) ? `${numeric.toFixed(2)}%` : String(value);

                return [formatted, isForecast ? "Predicted Intensity" : "Historical Intensity"];
              }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10b981" }}
              activeDot={{ r: 8, stroke: "#10b981", fill: "#10b981" }}
              isAnimationActive={false}
              data={data.filter((item) => !item.isForecast)}
            />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#facc15"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, stroke: "#facc15", fill: "#facc15" }}
              strokeDasharray="5 5"
              data={data.filter((item) => item.isForecast)}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-6 text-slate-400 text-sm">
          This graph displays the historical plant bloom intensity (green solid line) and a
          six-month forecast (yellow dotted line). The intensity is derived from NDVI values,
          indicating plant health. Higher values suggest more vigorous blooms. The forecast is
          generated using a simple linear regression model based on past trends.
        </p>
      </Card>

      {/* Chatbot will be rendered here */}
      <Chatbot />
    </div>
  );
}
