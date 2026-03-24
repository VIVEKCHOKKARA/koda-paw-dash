import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const hospitals = [
  { name: "Greenfield Veterinary", lat: 40.7128, lng: -74.006, distance: "1.2 km", phone: "+1 (555) 234-5678" },
  { name: "PawCare Clinic", lat: 40.7185, lng: -73.998, distance: "2.8 km", phone: "+1 (555) 345-6789" },
  { name: "AquaVet Center", lat: 40.7062, lng: -74.012, distance: "3.5 km", phone: "+1 (555) 456-7890" },
  { name: "Wild Care Hospital", lat: 40.7218, lng: -74.015, distance: "4.1 km", phone: "+1 (555) 567-8901" },
];

export function VetMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [40.7128, -74.006],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="width:32px;height:32px;background:hsl(145,25%,50%);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: "",
    });

    hospitals.forEach((h) => {
      L.marker([h.lat, h.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:DM Sans,sans-serif;padding:4px">
            <strong style="font-size:14px">${h.name}</strong><br/>
            <span style="color:#666;font-size:12px">📍 ${h.distance} away</span><br/>
            <span style="color:#666;font-size:12px">📞 ${h.phone}</span>
          </div>`,
          { className: "koda-popup" }
        );
    });

    // User location marker
    L.circleMarker([40.714, -74.008], {
      radius: 8,
      fillColor: "hsl(200,35%,58%)",
      color: "white",
      weight: 3,
      fillOpacity: 1,
    }).addTo(map).bindPopup("📍 You are here");

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full rounded-xl z-0" />;
}
