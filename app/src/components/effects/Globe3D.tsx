import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export function Globe3D() {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.5 }, 1000);
    }
  }, []);

  const locations = [
    { lat: 40.7128, lng: -74.0060, name: 'New York', size: 0.3, color: '#3b82f6' },
    { lat: 37.7749, lng: -122.4194, name: 'San Francisco', size: 0.3, color: '#3b82f6' },
    { lat: 51.5074, lng: -0.1278, name: 'London', size: 0.3, color: '#10b981' },
    { lat: 48.8566, lng: 2.3522, name: 'Paris', size: 0.2, color: '#10b981' },
    { lat: 35.6762, lng: 139.6503, name: 'Tokyo', size: 0.3, color: '#f59e0b' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore', size: 0.2, color: '#f59e0b' },
    { lat: -33.8688, lng: 151.2093, name: 'Sydney', size: 0.2, color: '#8b5cf6' },
    { lat: -23.5505, lng: -46.6333, name: 'São Paulo', size: 0.2, color: '#ec4899' },
  ];

  return (
    <div className="h-full w-full">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={locations}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointLabel="name"
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.2}
        animateIn={true}
      />
    </div>
  );
}
