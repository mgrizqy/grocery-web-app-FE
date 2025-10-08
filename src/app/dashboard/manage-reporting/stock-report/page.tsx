"use client";
import { MonthYearPicker } from "@/components/MonthYearPicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/auth-store";
import { useStore } from "@/store/useStore";
import { IStockHistory } from "@/types/stock";
import { IAdminStoreData, IStoreProps } from "@/types/store";
import { formatDate } from "@/utils/format";
import {
  CircleArrowDown,
  CircleArrowUp,
  PackageCheck,
  PackageX,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
const quantityColor = (value: number, type: string) => {
  if (type === "OUT") {
    return <p className="text-red-500">-{value}</p>;
  }
  return <p className="text-green-500">+{value}</p>;
};

export default function StockHistory() {
  // get store admin id
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem("user")!);
    if (jsonData?.role === "STORE_ADMIN") {
      const storeIdStr = jsonData.store_id?.toString();
      if (storeIdStr) {
        setSelectedStore(storeIdStr);
        useStore.getState().setSelectedStore(storeIdStr);
      }
    }
  }, []);

  const user = useAuthStore((state) => state.user);
  const { selectedStore, setSelectedStore } = useStore();
  const router = useRouter();
  const [storeList, setStoreList] = useState<IStoreProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [stockHistory, setStockHistory] = useState<IStockHistory[]>([]);
  const filteredHistory = stockHistory.filter((prd) =>
    prd.productStock.product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const [selectedDate, setSelectedDate] = useState<{
    month: number;
    year: number;
  }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [summary, setSummary] = useState({
    totalAddition: 0,
    totalReduction: 0,
    totalLatestStock: 0,
    totalOutOfStock: 0,
  });
  const summaryCard = [
    {
      id: 1,
      name: "Total Addition",
      icon: <CircleArrowUp className="text-green-500" />,
      border: "border-l-green-500 border-4 border-y ",
      total: (
        <span className="text-green-500 text-4xl font-bold ">
          {summary.totalAddition}
        </span>
      ),
    },
    {
      id: 2,
      name: "Total Reduction",
      icon: <CircleArrowDown className="text-amber-500" />,
      border: "border-l-amber-500 border-4",
      total: (
        <span className="text-amber-500 text-4xl font-bold ">
          {summary.totalReduction}
        </span>
      ),
    },
    {
      id: 3,
      name: "Total Latest Stock",
      icon: <PackageCheck className="text-purple-500" />,
      border: "border-l-purple-500 border-4",
      total: (
        <span className="text-purple-500 text-4xl font-bold ">
          {summary.totalLatestStock}
        </span>
      ),
    },
    {
      id: 4,
      name: "Total Out of Stock Product",
      icon: <PackageX className="text-red-500" />,
      border: "border-l-red-500 border-4",
      total: (
        <span className="text-red-500 text-4xl font-bold ">
          {summary.totalOutOfStock}
        </span>
      ),
    },
  ];

  const getStoreList = async () => {
    try {
      const res = await apiCall.get("/api/store/all");
      const result = res.data.data;
      setStoreList(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getStockHistory = async () => {
    const { month, year } = selectedDate;
    try {
      let res;
      if (selectedStore === "all") {
        res = await apiCall.get(
          `/api/stock/stock-history/summary-all-store?month=${month}&year=${year}`
        );
      } else {
        res = await apiCall.get(
          `/api/stock/stock-history/summary?storeId=${Number(selectedStore)}&month=${month}&year=${year}`
        );
      }
      const { stockHistory = [], summary = {} } = res.data.data ?? {};

      setStockHistory(Array.isArray(stockHistory) ? stockHistory : []);
      setSummary({
        totalAddition: summary.totalAddition ?? 0,
        totalReduction: summary.totalReduction ?? 0,
        totalLatestStock: summary.totalLatestStock ?? 0,
        totalOutOfStock: summary.totalOutOfStock ?? 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(stockHistory);

  useEffect(() => {
    getStoreList();
  }, []);
  useEffect(() => {
    getStockHistory();
  }, [selectedStore, selectedDate]);
  return (
    <DashboardLayout>
      <section
        id="store-selector"
        className="flex max-md:flex-col items-center gap-5 mb-5 justify-end"
      >
        <div className="flex gap-x-5">
          <div>
            <Button
              onClick={() =>
                router.replace("/dashboard/manage-reporting/sales-report")
              }
            >
              Sales Report
            </Button>
          </div>
          <div>
            <Select
              value={selectedStore}
              onValueChange={(value) => setSelectedStore(value)}
              disabled={user?.role === "STORE_ADMIN"}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Store Name"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Store Name</SelectLabel>
                  <SelectItem value="all">All Stores</SelectItem>
                  {storeList.map((store, idx) => (
                    <SelectItem key={idx} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <MonthYearPicker value={selectedDate} onChange={setSelectedDate} />
        </div>
      </section>
      <section
        id="summary-card"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-5 gap-5"
      >
        {summaryCard.map((s, idx) => (
          <Card key={idx} className={`${s.border}`}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="font-semibold text-lg">{s.name}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <p className="text-center">{s.total}</p>
            </CardContent>
            <CardFooter className="text-gray-400">This month</CardFooter>
          </Card>
        ))}
      </section>
      <section id="summary-chart"></section>

      <section id="stock-history-table">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Product Stock History</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reiciendis, nulla?
              </CardDescription>
            </div>
          </CardHeader>
          {/* Searchbar-filter-newprd */}
          <div className="flex max-md:flex-col justify-between gap-2 px-7">
            <div id="search-bar" className="w-full relative">
              <Search className="absolute top-2 right-2 size-5 text-gray-400" />
              <Input
                className="w-full"
                placeholder="Search product ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex justify-between gap-x-2">
              <div id="btn-newprd">
                <Button>New Product</Button>
              </div>
            </div>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Previous Stock</TableHead>
                  <TableHead className="text-center">Actual Stock</TableHead>

                  <TableHead className="text-center">Created at</TableHead>
                  <TableHead className="text-center">Store Name</TableHead>
                  <TableHead className="text-center">Created by</TableHead>
                  <TableHead className="text-center">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((prd, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{prd.productStock.product.name}</TableCell>
                    <TableCell className="text-center">{prd.type}</TableCell>
                    <TableCell className="text-center">
                      {quantityColor(prd.quantity, prd.type)}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.prev_stock}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.updated_stock}
                    </TableCell>

                    <TableCell className="text-center">
                      {formatDate(prd.created_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.productStock.store.name}
                    </TableCell>

                    <TableCell className="text-center">
                      {/* {prd.created_by?.first_name ?? "John"}{" "}
                      {prd.created_by?.last_name ?? "Doe"}
                       */}
                      {prd.created_by_name ?? ""}
                    </TableCell>
                    <TableCell className="text-center max-w-[150px] whitespace-normal break-words">
                      {prd.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </DashboardLayout>
  );
}
