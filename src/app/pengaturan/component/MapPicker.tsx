"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Fix default marker icon (karena di Next.js/Leaflet biasanya broken)
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  coords: [number, number] | null;
  onChange: (coords: [number, number]) => void;
}

function LocationMarker({ coords, onChange }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(coords);

  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onChange(newPos);
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

export default function MapPicker({ coords, onChange }: MapPickerProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <MapContainer
        center={coords || [-6.2, 106.8]} // default Jakarta
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker coords={coords} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
