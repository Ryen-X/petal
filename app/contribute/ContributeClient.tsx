'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContributeClient() {
  const [username, setUsername] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [ndviValue, setNdviValue] = useState<string>('');
  const [measurementDate, setMeasurementDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    setMeasurementDate(today.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    if (!username || !latitude || !longitude || !ndviValue) {
      setMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const ndvi = parseFloat(ndviValue);

    if (isNaN(lat) || isNaN(lon) || isNaN(ndvi)) {
      setMessage('Latitude, Longitude, and NDVI Value must be valid numbers.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_contributions')
        .insert([
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

      setMessage('Contribution submitted successfully!');
      setUsername('');
      setLatitude('');
      setLongitude('');
      setNdviValue('');
    } catch (err: unknown) {
      console.error('Error submitting contribution:', err);
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contribute NDVI Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="latitude">Approximate Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="longitude">Approximate Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ndviValue">NDVI Value</Label>
            <Input
              id="ndviValue"
              type="number"
              step="any"
              value={ndviValue}
              onChange={(e) => setNdviValue(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="measurementDate">Measurement Date</Label>
            <Input
              id="measurementDate"
              type="date"
              value={measurementDate}
              readOnly
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Contribution'}
          </Button>
          {message && (
            <p className={`text-center text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
