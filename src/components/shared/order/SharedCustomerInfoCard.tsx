import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User } from "lucide-react";

interface SharedCustomerInfoCardProps {
  name: string;
  phone: string | null;
  address: string;
  variant?: "card" | "plain";
}

const InfoGrid = ({
  name,
  phone,
  address,
}: {
  name: string;
  phone: string | null;
  address: string;
}) => (
  <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-y-2 text-sm">
    <span className="text-gray-500">Recipient</span>
    <span className="font-semibold text-gray-800">{name}</span>

    <span className="text-gray-500">Phone</span>
    <span className="text-gray-700">{phone || "N/A"}</span>

    <span className="text-gray-500">Address</span>
    <span className="leading-relaxed text-gray-700">{address}</span>
  </div>
);

export default function SharedCustomerInfoCard({
  name,
  phone,
  address,
  variant = "card",
}: SharedCustomerInfoCardProps) {
  if (variant === "plain") {
    return (
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          Shipping Address
        </h3>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <InfoGrid name={name} phone={phone} address={address} />
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="flex flex-row items-center gap-3">
        <User className="w-5 h-5 text-gray-500" />
        <CardTitle className="text-lg">Customer & Shipping</CardTitle>
      </CardHeader>
      <CardContent>
        <InfoGrid name={name} phone={phone} address={address} />
      </CardContent>
    </Card>
  );
}
