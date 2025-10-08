import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { IStockProps } from "@/types/stock";
import { PackageCheck, TrendingDown, X } from "lucide-react";
interface IInventoryHeader {
  stocks: IStockProps[];
}
export default function InventoryHeader({ stocks }: IInventoryHeader) {
  const { selectedStore, setSelectedStore } = useStore();
  const filteredStocks =
    selectedStore === "all"
      ? stocks
      : stocks.filter((s) => s.store.id.toString() === selectedStore);

  console.log(filteredStocks);

  const cardHeader = [
    {
      id: 1,
      name: "Total Normal Stock Product",
      icon: (
        <PackageCheck className="bg-green-500 text-white rounded-full p-2 size-10" />
      ),
      // qty: stocks.filter((e) => e.product.is_active === true).length,
      qty: filteredStocks.filter((e) => e.stock_quantity > e.min_stock).length,
    },
    {
      id: 2,
      name: "Total Low Stock Product",
      icon: (
        <TrendingDown className="bg-yellow-400 text-white rounded-full p-2 size-10" />
      ),
      qty: filteredStocks.filter((e) => e.stock_quantity <= e.min_stock).length,
    },
    {
      id: 3,
      name: "Total Out of Stock Product",
      icon: <X className="bg-red-500 text-white rounded-full p-2 size-10" />,
      qty: filteredStocks.filter((e) => e.stock_quantity === 0).length,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
      {cardHeader.map((card, idx) => (
        <Card key={idx}>
          <CardHeader className="flex flex-col xl:flex-row xl:text-start xl:gap-x-4  xl:justify-start items-center justify-center text-center">
            <div className="my-2">{card.icon}</div>
            <div>
              <CardTitle className="lg:text-xl">{card.name}</CardTitle>
              <CardDescription className="text-xs my-1">
                Lorem ipsum dolor, sit amet consectetur adipisicing
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center font-semibold text-4xl">{card.qty}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
