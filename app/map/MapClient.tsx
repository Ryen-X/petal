// app/map/MapClient.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { createClient } from '@/lib/supabase/client';

type NdviDataPoint = {
  id: number;
  latitude: number;
  longitude: number;
  ndvi_value: number;
  measurement_date?: string | null;
  username?: string;
  source: 'modis' | 'user_contribution';
};

export default function MapClient(): JSX.Element {
  const [points, setPoints] = useState<NdviDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modisIcon = useMemo(() => L.icon({
    iconUrl: '/images/marker-icon.svg',
    iconSize: [32, 32], 
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }), []);

  const userIcon = useMemo(() => L.icon({
    iconUrl: '/images/marker-icon-red.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32] 
  }), []);

  useEffect(() => {
    const href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data: modisData, error: modisError } = await supabase
          .from('ndvi_data')
          .select('id, latitude, longitude, ndvi_value, measurement_date')
          .order('measurement_date', { ascending: false })
          .limit(1000);

        if (modisError) {
          throw modisError;
        }

        const modisPoints = (modisData || []).map(point => ({
          ...point,
          source: 'modis',
        }));

        const { data: userData, error: userError } = await supabase
          .from('user_contributions')
          .select('id, username, latitude, longitude, ndvi_value, measurement_date')
          .order('measurement_date', { ascending: false })
          .limit(1000);

        if (userError) {
          throw userError;
        }

        const userPoints = (userData || []).map(point => ({
          ...point,
          source: 'user_contribution',
        }));

        const combinedPoints = [...modisPoints, ...userPoints];

        console.log("Fetched combined data (first 100):", combinedPoints ? combinedPoints.slice(0, 100) : []);
        if (mounted) {
          setPoints(combinedPoints as NdviDataPoint[]);
        }
      } catch (err: unknown) {
        console.error('Failed to load NDVI points', err);
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const defaultCenter: LatLngExpression = [34.052235, -118.243683];

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {/* MapContainer must have a height via parent element */}
      <MapContainer
        center={defaultCenter}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render markers from Supabase */}
        {points.map((p) => {
          if (
            typeof p.latitude !== 'number' ||
            typeof p.longitude !== 'number' ||
            Number.isNaN(p.latitude) ||
            Number.isNaN(p.longitude)
          ) {
            return null;
          }
          const pos: LatLngExpression = [p.latitude, p.longitude];
          const iconToUse = p.source === 'modis' ? modisIcon : userIcon;

          return (
            <Marker key={p.id} position={pos} icon={iconToUse}>
              <Popup>
                <div style={{ minWidth: 120 }}>
                  <div>
                    <strong>NDVI:</strong> {Number(p.ndvi_value).toFixed(3)}
                  </div>
                  {p.measurement_date && (
                    <div>
                      <strong>Date:</strong> {new Date(p.measurement_date).toLocaleDateString()}
                    </div>
                  )}
                  {p.source === 'modis' ? (
                    <div>
                      <strong>Source:</strong> Loaded from MODIS dataset
                    </div>
                  ) : (
                    <div>
                      <strong>Contributor:</strong> {p.username || 'Anonymous'}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Simple status overlay */}
      <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 1000 }}>
        {loading && <div className="rounded bg-white/90 p-2 shadow">Loading…</div>}
        {error && (
          <div className="rounded bg-red-500/90 text-white p-2 shadow" title={error}>
            {error}
          </div>
        )}
        {!loading && !error && points.length === 0 && (
          <div className="rounded bg-white/90 p-2 shadow">No points</div>
        )}
      </div>
    </div>
  );
}
