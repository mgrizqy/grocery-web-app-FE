"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderDetail } from "@/components/types";
import {
  Bolt,
  CreditCard,
  Loader2,
  Truck,
  Upload,
  XCircle,
} from "lucide-react";
import { useUploadProofStore } from "@/store/upload-proof-store";
import CountdownTimer from "./CountdownTimer";

interface ActionCenterCardProps {
  order: OrderDetail;
  onCancel: () => void;
  onConfirm: () => void;
  onPay: () => void;
  isLoading: boolean;
}

export default function ActionCenterCard({
  order,
  onCancel,
  onConfirm,
  onPay,
  isLoading,
}: ActionCenterCardProps) {
  const { file, previewUrl, loading: isUploading, error, setFile, uploadProof, reset } =
    useUploadProofStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmitProof = async () => {
    const result = await uploadProof(order.id);
    if (result.success) {
      reset();
    }
  };

  if (order.status === "PENDING_PAYMENT") {
    const paymentExpiryDate = new Date(
      new Date(order.createdAt).getTime() + 60 * 60 * 1000
    ).toISOString();

    if (order.payment?.method === "Manual Bank Transfer") {
      return (
        <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center bg-primary-green-100 rounded-full">
                <Bolt className="w-4 h-4 text-primary-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                Complete Your Payment
              </h3>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800 text-center">
              <p className="font-semibold text-orange-900">Bank BCA</p>
              <p>
                Account Number:{" "}
                <span className="font-bold text-orange-900">1234567890</span>
              </p>
              <p>
                Account Holder:{" "}
                <span className="font-bold text-orange-900">PT Groceria</span>
              </p>
            </div>

            <CountdownTimer expiryDate={paymentExpiryDate} />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />

            {!file ? (
              <div
                onClick={handleSelectFileClick}
                className="border border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50"
              >
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full h-10 text-sm font-bold text-primary-green-600 pointer-events-none"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select Payment Proof
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center gap-3">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Payment proof preview"
                      width={128}
                      height={128}
                      className="max-h-32 w-auto rounded-md border"
                    />
                  )}
                  <p className="text-sm font-medium text-gray-700 truncate">
                    File: <span className="font-semibold">{file.name}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitProof}
                      disabled={isUploading}
                      className="bg-primary-green-600 hover:bg-primary-green-700 h-10 text-sm px-4"
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Submit Proof"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFile(null)}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="border-t border-dashed pt-4">
              <Button
                onClick={onCancel}
                disabled={isLoading}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-10 text-sm px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={onPay}
                disabled={isLoading}
                className="w-full bg-primary-green-600 hover:bg-primary-green-700 h-10 text-sm px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Pay Now
              </Button>
              <Button
                onClick={onCancel}
                disabled={isLoading}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-10 text-sm px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  if (order.status === "SHIPPED") {
    return (
      <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
        <CardContent className="p-4 sm:p-6">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-primary-green-600 hover:bg-primary-green-700 h-10 text-sm px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Truck className="w-4 h-4 mr-2" />
            )}
            I've Received My Order
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}