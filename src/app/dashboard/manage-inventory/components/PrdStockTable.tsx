"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useStore } from "@/store/useStore";
import { IStockProps } from "@/types/stock";
import { formatDate } from "@/utils/format";
import { PackageSearch, Search } from "lucide-react";
import { useEffect, useState } from "react";
import EditStockProduct from "./EditStockPrd";
interface IProductStock {
  className?: string;
  stocks: IStockProps[];
  adminStoreData: any;
}

const stockStatus = (current: number, minStock: number) => {
  if (current > minStock) {
    return <Badge className="bg-green-500">Normal</Badge>;
  } else if (current <= minStock && current !== 0) {
    return <Badge className="bg-yellow-400">Low Stock</Badge>;
  } else if (current === 0) {
    return <Badge className="bg-red-500">Out of Stock</Badge>;
  }
};

export default function ProductStock({
  className,
  stocks,
  adminStoreData,
}: IProductStock) {
  const { storesData, fetchAllStores, selectedStore, setSelectedStore } =
    useStore();
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchAllStores();
  }, []);

  const [editStock, setEditStock] = useState(false);
  const [selectedProductStock, setSelectedProductStock] =
    useState<IStockProps | null>(null);
  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Product Stock Table</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis, nulla?
            </CardDescription>
          </div>
          <div>
            {adminStoreData?.role !== "STORE_ADMIN" && (
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Store Name"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Store Name</SelectLabel>
                    <SelectItem value="all">All Stores</SelectItem>
                    {storesData
                      .filter((store) => {
                        if (adminStoreData?.role !== "STORE_ADMIN") return true;
                        return store.id === adminStoreData?.store_id;
                      })
                      .map((store, idx) => (
                        <SelectItem key={idx} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        {/* Searchbar-filter-newprd */}
        <div className="flex max-md:flex-col justify-between gap-2 px-7">
          <div id="search-bar" className="w-full relative">
            <Search className="absolute top-2 right-2 size-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="w-full"
              placeholder="Search product ..."
            />
          </div>
          <div className="flex justify-between gap-x-2">
            <div id="filter-status">
              <Select
                value={stockStatusFilter}
                onValueChange={(value) => setStockStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Product Stock</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="oos">Out of Stock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Min Stock</TableHead>
                <TableHead className="text-center">Store Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Active/Inactive</TableHead>
                <TableHead className="text-center">Updated at</TableHead>
                <TableHead className="text-center">Update Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks
                .filter((prd) => {
                  const isStoreMatch =
                    selectedStore === "all" ||
                    prd.store.id.toString() === selectedStore;

                  const isSearchMatch = prd.product.name
                    .toLowerCase()
                    .includes(searchQuery);

                  const stockQty = prd.stock_quantity;
                  const minQty = prd.min_stock;

                  const isStatusMatch =
                    stockStatusFilter === "all" ||
                    (stockStatusFilter === "normal" && stockQty > minQty) ||
                    (stockStatusFilter === "low" &&
                      stockQty <= minQty &&
                      stockQty !== 0) ||
                    (stockStatusFilter === "oos" && stockQty === 0);

                  return isStoreMatch && isSearchMatch && isStatusMatch;
                })
                .map((prd, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{prd.product.name}</TableCell>
                    <TableCell className="text-center">
                      {prd.stock_quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.min_stock}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.store.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {stockStatus(prd.stock_quantity, prd.min_stock)}
                    </TableCell>
                    <TableCell className="text-center">
                      {prd.product.is_active === true ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(prd.updated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-x-2">
                        <Button
                          variant={"outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedProductStock(prd);
                            setEditStock((prev) => !prev);
                          }}
                        >
                          <PackageSearch /> Update
                        </Button>
                        {/* <Button
                        variant={"destructive"}
                        className="cursor-pointer"
                      >
                        <Trash />
                      </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Edit Stock Dialog */}
      <EditStockProduct
        open={editStock}
        setOpen={setEditStock}
        selectedProduct={selectedProductStock}
      />
    </div>
  );
}
