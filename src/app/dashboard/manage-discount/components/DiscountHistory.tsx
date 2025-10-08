import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { useFilteredDiscounts } from "@/helper/filteredDiscount";
import { useAuthStore } from "@/store/auth-store";
import { useDiscountStore } from "@/store/useDiscount";
import { useStore } from "@/store/useStore";
import { Search, Trash } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface IDiscountHistory {
  discountType: string;
  setDiscountType: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
const discountStatusbyDate = (start_date: Date, end_date: Date) => {
  const today = new Date();
  if (today < start_date) {
    return <Badge className="bg-amber-500">Upcoming</Badge>;
  }
  if (today >= start_date && today <= end_date) {
    return <Badge className="bg-green-500">Active</Badge>;
  }
  if (today > end_date) {
    return <Badge variant={"destructive"}>Expired</Badge>;
  }
  return null;
};
export default function DiscountHistory({
  discountType,
  setDiscountType,
  searchQuery,
  setSearchQuery,
}: IDiscountHistory) {
  const { selectedStore, setSelectedStore, fetchAllStores, storesData } =
    useStore();
  const userRole = useAuthStore((state) => state.user.role);
  const discounts = useDiscountStore((state) => state.discounts);
  const filteredDiscounts = useFilteredDiscounts(
    discounts,
    discountType,
    searchQuery
  );
  console.log(filteredDiscounts);
  // const untuk selector
  // const [searchQuery, setSearchQuery] = useState("");
  // const [discountType, setDiscountType] = useState("all");
  //
  const removeDiscount = useDiscountStore((state) => state.removeDiscount);
  const deleteDiscount = async (id: number) => {
    const confirm = window.confirm("Anda yakin delete discount ini ?");
    if (!confirm) return;
    try {
      const res = await apiCall.patch(`/api/discount/delete/${id}`);
      toast.success("Delete Discount History Success");
      removeDiscount(id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllStores();
  }, []);

  return (
    <section className="p-4 mt-5">
      <h1 className="text-xl font-semibold">Filter and Search Bar</h1>
      <div id="filter-search" className="flex max-lg:flex-col gap-x-5">
        <div className="w-full relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search . . . ."
          />
          <Search className="absolute text-gray-300 top-1.5 right-2 size-5" />
        </div>
        <div className="max-lg:mt-5 flex gap-x-2">
          {/* Filter Store */}
          <Select
            value={selectedStore}
            onValueChange={(value) => setSelectedStore(value)}
            disabled={userRole === "STORE_ADMIN"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Store</SelectItem>
              {storesData.map((store, idx) => (
                <SelectItem key={idx} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Filter Discount Types */}
          <Select
            value={discountType}
            onValueChange={(value) => setDiscountType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Discount Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="MANUAL">Manual per Product</SelectItem>
              <SelectItem value="MIN_PURCH">Minimum Total Payment</SelectItem>
              <SelectItem value="B1G1">Buy One Get One</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div id="content" className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Product Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Total Usage</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Created by</TableHead>
              <TableHead className="text-center">Store Name</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-center">
                    {d.product.name}
                  </TableCell>
                  <TableCell className="text-center">{d.code}</TableCell>
                  <TableCell className="text-center">
                    {d.type === "MANUAL"
                      ? "Manual per Product"
                      : d.type === "MIN_PURCHASE"
                        ? "Minimum Total Payment"
                        : "Buy One Get One"}
                  </TableCell>
                  <TableCell className="text-center">
                    {d.usage?.length || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {discountStatusbyDate(
                      new Date(d.start_date),
                      new Date(d.end_date)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {d.creator.first_name} {d.creator.last_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {d.store?.name || "-"}
                  </TableCell>
                  <TableCell className="flex gap-x-3 justify-center">
                    <Button
                      variant={"destructive"}
                      className="cursor-pointer"
                      onClick={() => deleteDiscount(d.id)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No discounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
