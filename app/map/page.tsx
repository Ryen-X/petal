// app/map/page.tsx
import dynamic from 'next/dynamic';
import React from 'react';

// dynamically load client-only map (no SSR)
const MapClient = dynamic(() => import('@/app/map/MapClient'), { ssr: false });

export default function Page() {
  return (
    <main className="h-screen w-screen">
      <MapClient />
    </main>
  );
}
