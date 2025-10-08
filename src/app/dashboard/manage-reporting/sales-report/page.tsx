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
import { IStoreProps } from "@/types/store";
import { formatIDRCurrency, upperFirstCharacter } from "@/utils/format";
import { BadgeDollarSign, Search, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/auth-store";
interface Summary {
  totalSales: number;
  totalQuantity: number;
  totalOrder: number;
  totalRefund: number;
}

export default function SalesReport() {
  const [selectedStore, setSelectedStore] = useState("all");
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
  // get login user
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [storeList, setStoreList] = useState<IStoreProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<{
    month: number;
    year: number;
  }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [summary, setSummary] = useState<Summary>({
    totalSales: 0,
    totalQuantity: 0,
    totalOrder: 0,
    totalRefund: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);

  const getStoreList = async () => {
    try {
      const res = await apiCall.get("/api/store/all");
      const result = res.data.data;
      setStoreList(result);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(selectedDate);
  // console.log(selectedStore);
  const getOrderList = async () => {
    const { month, year } = selectedDate;
    try {
      let res;
      if (selectedStore === "all") {
        res = await apiCall.get(
          `/api/report/orders?month=${month}&year=${year}`
        );
      } else {
        res = await apiCall.get(
          `/api/report/orders/by-store?storeId=${Number(selectedStore)}&month=${month}&year=${year}`
        );
      }

      const result = res.data.data ?? [];

      const ordersData = Array.isArray(result) ? result : (result.orders ?? []);

      setOrders(ordersData);
      setSummary({
        totalSales:
          result.summary?.totalSales ??
          ordersData.reduce((a: any, b: any) => a + (b.totalSales ?? 0), 0),
        totalQuantity:
          result.summary?.totalQuantity ??
          ordersData.reduce((a: any, b: any) => a + (b.quantity ?? 0), 0),
        totalOrder: result.summary?.totalOrder ?? ordersData.length,
        totalRefund: result.summary?.totalRefund ?? 0,
      });

      // Dapatkan unique values langsung dari 'ordersData' (BUKAN dari state 'orders')
      const uniqueCategories = ordersData.reduce((acc: string[], curr: any) => {
        if (!acc.includes(curr.category)) {
          acc.push(curr.category);
        }
        return acc;
      }, []);

      const uniqueProducts = ordersData.reduce((acc: string[], curr: any) => {
        if (!acc.includes(curr.product)) {
          acc.push(curr.product);
        }
        return acc;
      }, []);

      setCategories(uniqueCategories);
      setProducts(uniqueProducts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStoreList();
  }, []);

  const summaryCard = [
    {
      id: 1,
      name: "Total Sales",
      icon: <BadgeDollarSign className="text-green-500" />,
      border: "border-l-green-500 border-4 border-y ",
      total: (
        <span className="text-green-500 text-4xl font-bold ">
          {formatIDRCurrency(summary.totalSales)}
        </span>
      ),
      desc: "this month  (by SHIPPED transaction status)",
    },
    {
      id: 2,
      name: "Total Sold Product",
      icon: <ShoppingBag className="text-amber-500" />,
      border: "border-l-amber-500 border-4",
      total: (
        <span className="text-amber-500 text-4xl font-bold ">
          {summary.totalQuantity}
        </span>
      ),
      desc: "products this month (by SHIPPED transaction status)",
    },
  ];

  // filter orders sesuai category, product, search
  const filteredOrders = orders.filter((o) => {
    const matchCategory =
      selectedCategory === "all" || o.category === selectedCategory;
    const matchProduct =
      selectedProduct === "all" || o.product === selectedProduct;
    const matchSearch = o.product
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchProduct && matchSearch;
  });
  useEffect(() => {
    getOrderList();
  }, [selectedDate, selectedStore]);
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
                router.replace("/dashboard/manage-reporting/stock-report")
              }
            >
              Stock Report
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
                  <SelectItem value="all">All Store</SelectItem>
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
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-5"
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
            <CardFooter className="text-gray-400 text-xs">{s.desc}</CardFooter>
          </Card>
        ))}
      </section>
      <section id="stock-history-table">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Report</CardTitle>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                placeholder="Search product ..."
              />
            </div>
            <div className="flex justify-between gap-x-2">
              <div id="filter-category">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Category"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      {categories.map((cat, idx) => (
                        <SelectItem key={idx} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div id="filter-product">
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Choose Product"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Product Name</SelectLabel>
                      <SelectItem value="all">All Product </SelectItem>
                      {products.map((prd, idx) => (
                        <SelectItem key={idx} value={prd}>
                          {prd}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Total Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((prd, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{prd.product}</TableCell>
                    <TableCell className="text-center">
                      {upperFirstCharacter(prd.category)}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatIDRCurrency(prd.totalSales)}
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
