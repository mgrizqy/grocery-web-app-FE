export const formatIDRCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const upperFirstCharacter = (char: string) => {
  return char.charAt(0).toUpperCase() + char.slice(1);
};

// format date (Kamis, 20 April 2025)
export const formatDate = (value: string | Date) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// format date (05/05/2025)
export const formatIntlDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // bulan dimulai dari 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};