import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface PaymentProofCardProps {
  proofUrl: string;
}

export default function PaymentProofCard({ proofUrl }: PaymentProofCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 p-0">
      <CardHeader className="flex flex-row items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-6 pb-0">
        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
          <ImageIcon className="w-4 h-4 text-blue-600" />
        </div>
        <CardTitle className="text-base sm:text-lg font-bold">
          Payment Proof
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 -mt-2">
        <a href={proofUrl} target="_blank" rel="noopener noreferrer">
          <Image
            src={proofUrl}
            alt="Payment Proof"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg border hover:ring-2 hover:ring-primary-green-500 transition-all"
          />
        </a>
      </CardContent>
    </Card>
  );
}