"use client";
import PaginationControls from "@/components/PaginationControls";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { IStoreProps } from "@/types/store";
import { Search } from "lucide-react";
import { useState } from "react";
import StoreCardStacks from "./StoreCardStacks";
import StoreTable from "./StoreTable";
interface IStoreAdminTable {
  className?: string;
  stores: IStoreProps[];
}

export default function StoreData({ className, stores }: IStoreAdminTable) {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<"active" | "inactive" | "all">(
    "all"
  );
  // console.log(stores);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStores = [...filteredStores].sort((a, b) => {
    if (!orderStatus) return 0;

    if (orderStatus === "active") {
      return Number(b.is_active) - Number(a.is_active);
    }

    if (orderStatus === "inactive") {
      return Number(a.is_active) - Number(b.is_active);
    }

    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 5;
  const indexOfLast = currentPage * storesPerPage;
  const indexofFirst = indexOfLast - storesPerPage;
  const currentStores = sortedStores.slice(indexofFirst, indexOfLast);
  const totalPages = Math.ceil(sortedStores.length / storesPerPage);

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-col justify-between">
        <div className="w-full">
          <p className="text-xl font-semibold">Store Data</p>
        </div>

        <div className="flex  gap-x-1 w-full">
          <div id="searchbar" className="relative w-full">
            <Input
              placeholder="Search by Name/City ..."
              className="text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
            <Search className="absolute size-4 top-2.5 right-2 text-gray-400" />
          </div>
          <div id="filter">
            <Select
              value={orderStatus}
              onValueChange={(value) =>
                setOrderStatus(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <StoreTable stores={currentStores} />
        <StoreCardStacks stores={currentStores} />
      </CardContent>
      <CardFooter>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
}
