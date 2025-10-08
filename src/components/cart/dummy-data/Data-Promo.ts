import { PromoCode } from "@/components/types";

export const mockPromoCodes: PromoCode[] = [
  {
    code: "WELCOME10",
    description: "10% off for first-time buyers",
    type: "percentage",
    value: 10,
  },
  {
    code: "SAVE50K",
    description: "Save Rp 50.000 on orders over Rp 300.000",
    type: "fixed",
    value: 50000,
  },
];
