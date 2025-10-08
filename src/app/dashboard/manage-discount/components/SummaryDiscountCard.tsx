import { Card, CardContent } from "@/components/ui/card";
import { useFilteredDiscounts } from "@/helper/filteredDiscount";
import { useDiscountStore } from "@/store/useDiscount";
import { IDiscountProps } from "@/types/discount";
import {
  CalendarClock,
  CalendarX,
  PercentSquare,
  TicketPercent,
} from "lucide-react";

interface ISummaryDiscountCard {
  className?: string;
  discountType: string;
  searchQuery: string;
}

export default function SummaryDiscountCard({
  discountType,
  searchQuery,
}: ISummaryDiscountCard) {
  // discounts data
  const discounts = useDiscountStore((state) => state.discounts);
  const filteredDiscounts = useFilteredDiscounts(
    discounts,
    discountType,
    searchQuery
  );
  // hitung banyak active/expired/scheduled
  const today = new Date();

  const activeDiscount = filteredDiscounts.filter((d) => {
    const start = new Date(d.start_date);
    const end = new Date(d.end_date);
    return today >= start && today <= end;
  });

  const expiredDiscount = filteredDiscounts.filter((d) => {
    const end = new Date(d.end_date);
    return today > end;
  });

  const scheduleDiscount = filteredDiscounts.filter((d) => {
    const start = new Date(d.start_date);
    return today < start;
  });

  const summaryCard = [
    {
      id: 1,
      name: "Total Discount Created",
      icon: (
        <PercentSquare className="bg-amber-400 rounded-sm size-10 p-2 text-white" />
      ),
      qty: filteredDiscounts.length,
    },
    {
      id: 2,
      name: "Total Active Discount",
      icon: (
        <TicketPercent className="bg-green-300/60 rounded-sm size-10 p-2 text-green-500" />
      ),
      qty: activeDiscount.length,
    },
    {
      id: 3,
      name: "Total Expired Discount",
      icon: (
        <CalendarX className="bg-red-300/60 rounded-sm size-10 p-2 text-red-500" />
      ),
      qty: expiredDiscount.length,
    },
    {
      id: 4,
      name: "Total Scheduled Discount",
      icon: (
        <CalendarClock className="bg-yellow-300/50 rounded-sm size-10 p-2 text-yellow-500" />
      ),
      qty: scheduleDiscount.length,
    },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
      {summaryCard.map((card, idx) => (
        <Card key={idx}>
          <CardContent className="flex items-center gap-x-5">
            <div id="icon">{card.icon}</div>
            <div>
              <p className="text-lg  text-gray-500 ">{card.name}</p>
              <p className="text-xl font-semibold">{card.qty}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
