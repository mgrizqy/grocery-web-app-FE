import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPickerInner"), { ssr: false });

interface MapPickerWrapperProps {
  lat: number;
  long: number;
  street: string;
  city: string;
  province: string;
  onLocationSelect: (data: { lat: number; long: number }) => void;
}

export default function MapPickerWrapper({
  lat,
  long,
  street,
  city,
  province,
  onLocationSelect,
}: MapPickerWrapperProps) {
  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-40 sm:h-60 lg:h-80 mx-auto my-4 rounded-lg overflow-hidden shadow-md">
      <MapPicker
        disabled={false}
        defaultLocation={{ lat, long, road: street, city, province }}
        onLocationSelect={onLocationSelect}
      />
    </div>
  );
}
