"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon not showing
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ContributeClient() {
  const [username, setUsername] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [ndviValue, setNdviValue] = useState<string>("");
  const [measurementDate, setMeasurementDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // Default center

  useEffect(() => {
    const today = new Date();
    setMeasurementDate(today.toISOString().split("T")[0]);

    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (error) => {
          console.error("Error getting user location:", error);
          setMessage("Could not retrieve your location. Please enter manually or click on the map.");
        }
      );
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setLatitude(e.latlng.lat.toFixed(6));
        setLongitude(e.latlng.lng.toFixed(6));
      },
    });
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    if (!username || !latitude || !longitude || !ndviValue) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const ndvi = parseFloat(ndviValue);

    if (isNaN(lat) || isNaN(lon) || isNaN(ndvi)) {
      setMessage("Latitude, Longitude, and NDVI Value must be valid numbers.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("user_contributions").insert([
        {
          username,
          latitude: lat,
          longitude: lon,
          ndvi_value: ndvi,
          measurement_date: measurementDate,
          geo: `POINT(${lon} ${lat})`,
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage("Contribution submitted successfully!");
      setUsername("");
      setLatitude("");
      setLongitude("");
      setNdviValue("");
    } catch (err: unknown) {
      console.error("Error submitting contribution:", err);
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl text-white">
      <CardHeader>
        <CardTitle className="text-white">Contribute NDVI Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <Label htmlFor="latitude" className="text-white">Approximate Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <Label htmlFor="longitude" className="text-white">Approximate Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <Label htmlFor="ndviValue" className="text-white">NDVI Value (max value is 1)</Label>
            <Input
              id="ndviValue"
              type="number"
              step="any"
              value={ndviValue}
              onChange={(e) => setNdviValue(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <Label htmlFor="measurementDate" className="text-white">Measurement Date</Label>
            <Input
              id="measurementDate"
              type="date"
              value={measurementDate}
              readOnly
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
            {loading ? "Submitting..." : "Submit Contribution"}
          </Button>
          {message && (
            <p className={`text-center text-sm ${message.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 h-64 w-full rounded-lg overflow-hidden border border-slate-700">
          <MapContainer
            center={mapCenter}
            zoom={2}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {latitude && longitude && (
              <Marker position={[parseFloat(latitude), parseFloat(longitude)]} />
            )}
            <MapClickHandler />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
