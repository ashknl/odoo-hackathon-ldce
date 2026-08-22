import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons with Vite bundling
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// @ts-ignore
L.Marker.prototype.options.icon = DefaultIcon;

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
}

interface PlacesMapProps {
  markers?: MapMarker[];
  height?: number;
  onSelect?: (marker: MapMarker) => void;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Reusable Leaflet/OpenStreetMap component.
 * Matches the pattern used in demo/frontend/src/components/PlacesMap.jsx.
 * markers: [{ id, lat, lng, title, subtitle? }]
 */
export const PlacesMap: React.FC<PlacesMapProps> = ({
  markers = [],
  height = 380,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Re-render markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const points = markers
      .map((m) => {
        const lat = Number(m.lat);
        const lng = Number(m.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { ...m, lat, lng };
      })
      .filter(Boolean) as MapMarker[];

    if (points.length === 0) {
      map.setView([20, 0], 2);
      return;
    }

    const bounds: [number, number][] = [];
    points.forEach((p) => {
      const marker = L.marker([p.lat, p.lng]);
      const html = `<strong>${escapeHtml(p.title || 'Place')}</strong>${
        p.subtitle ? `<br/><span style="color:#555;font-size:0.8rem">${escapeHtml(p.subtitle)}</span>` : ''
      }`;
      marker.bindPopup(html);
      if (onSelect) {
        marker.on('click', () => onSelect(p));
      }
      marker.addTo(layer);
      bounds.push([p.lat, p.lng]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 11);
    } else {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    setTimeout(() => map.invalidateSize(), 50);
  }, [markers, onSelect]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden', zIndex: 0 }}
    />
  );
};
