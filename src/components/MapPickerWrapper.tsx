import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./MapPickerInner"), {
  ssr: false,
});

// export default function MapPickerWrapper() {
//   return <MapPicker />;
// }

export default MapPicker;
