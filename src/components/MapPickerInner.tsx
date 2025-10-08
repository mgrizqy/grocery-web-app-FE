"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocateIcon } from "lucide-react";
import L, { marker } from "leaflet";

// Fix default marker icon
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Fungsi ambil alamat dari koordinat
async function getAddressFromCoords(lat: number, long: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`
  );
  const data = await res.json();
  const addr = data.address ?? {};
  console.log(data);

  return {
    fullAddress: data.display_name || "",
    road: addr.road || addr.neighbourhood || addr.suburb || "",
    // city: addr.city || addr.town || addr.village || addr.municipality || "",
    city: addr.county || addr.city || addr.town || addr.city_district || "",
    province: addr.state || addr.region || "",
    postalCode: addr.postcode ?? "",
    country: addr.country ?? "",
  };
}

// Component untuk klik map dan pasang marker
function LocationMarker({
  position,
  onSelect,
  disabled,
}: {
  position: [number, number] | null;
  onSelect: (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => void;
  disabled: boolean;
}) {
  // const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  useMapEvents({
    async click(e) {
      if (disabled) return;
      const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
      // setMarkerPos(pos);
      const addr = await getAddressFromCoords(pos[0], pos[1]);
      onSelect({
        lat: pos[0],
        long: pos[1],
        road: addr.road,
        city: addr.city,
        province: addr.province,
      });
    },
  });

  return position && <Marker position={position} />;
}

// Tombol GPS di atas map
function UseMyLocationButton({
  onLocationSelect,
  map,
}: {
  onLocationSelect: (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => void;
  map: L.Map;
}) {
  const handleClick = () => {
    if (!map) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        map.setView([lat, lng], 15);

        const addr = await getAddressFromCoords(lat, lng);
        onLocationSelect({
          lat,
          long: lng,
          road: addr.road,
          city: addr.city,
          province: addr.province,
        });
      });
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="absolute bottom-2 right-3   z-[1000] px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg flex items-center gap-2 hover:bg-blue-700"
      >
        <LocateIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function MapPicker({
  onLocationSelect,
  defaultLocation,
  disabled,
}: {
  onLocationSelect: (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => void;
  defaultLocation?: {
    lat: number;
    long: number;
    road?: string;
    city: string;
    province: string;
  };
  disabled: boolean;
}) {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    defaultLocation ? [defaultLocation.lat, defaultLocation.long] : null
  );

  const handleSelect = (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => {
    setMarkerPos([data.lat, data.long]);
    onLocationSelect(data);
  };

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      setMapInstance(mapRef.current);
    }
  }, [mapRef.current]);

  return (
    <div className="relative w-full h-[200px] rounded-md overflow-hidden">
      <MapContainer
        center={
          defaultLocation
            ? [defaultLocation.lat, defaultLocation.long]
            : [-6.2, 106.8]
        }
        dragging={!disabled}
        doubleClickZoom={!disabled}
        zoomControl={!disabled}
        scrollWheelZoom={!disabled}
        zoom={13}
        style={{ width: "100%", height: "80%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          disabled={disabled}
          position={markerPos}
          onSelect={handleSelect}
        />
      </MapContainer>

      {mapInstance && !disabled && (
        <UseMyLocationButton
          onLocationSelect={handleSelect}
          map={mapInstance}
        />
      )}
    </div>
  );
}
