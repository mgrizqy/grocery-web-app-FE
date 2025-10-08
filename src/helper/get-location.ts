export async function getLocationInfo(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=id`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch location data");

  const data = await res.json();
  const component = data.results[0]?.components;

  return {
    city: component.city || component.town || component.village || null,
    province: component.state || null,
  };
}
