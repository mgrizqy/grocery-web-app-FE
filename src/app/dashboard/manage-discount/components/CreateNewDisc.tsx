"use client";

import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/auth-store";
import { useStore } from "@/store/useStore";
import { IProductProps } from "@/types/product";
import { formatIntlDate } from "@/utils/format";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ICreateNewDiscount {
  open: boolean;
  setOpen: (value: boolean) => void;
  onCreate: (newDiscount: any) => void;
}

export default function CreateNewDiscount({
  open,
  setOpen,
}: ICreateNewDiscount) {
  const [productByStore, setProductByStore] = useState<IProductProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const { selectedStore, setSelectedStore, fetchAllStores, storesData } = useStore();
  const user = useAuthStore((state) => state.user);
  const [discountCode, setDiscountCode] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [discType, setDiscType] = useState("");

  // Conditional input states
  const [valueType, setValueType] = useState("");
  const [discAmount, setDiscAmount] = useState("");
  const [minPurch, setMinPurch] = useState("");

  // GET Store List
  useEffect(() => {
    fetchAllStores();
  }, []);

  // GET Products by Store
  useEffect(() => {
    if (!selectedStore) return;
    const fetchProducts = async () => {
      try {
        const res = await apiCall.get(
          `/api/product/store/${Number(selectedStore)}`
        );
        const mappingData = res.data.data.map((prd: any) => prd.product);
        setProductByStore(mappingData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [selectedStore]);

  // Reset conditional inputs on discType change
  useEffect(() => {
    setValueType("");
    setDiscAmount("");
    setMinPurch("");
  }, [discType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: any = {
      name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement)
        .value,
      product_id: Number(selectedProduct),
      store_id: Number(selectedStore),
      code: discountCode,
      description: (
        e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
      type: discType,
      start_date: dateRange.from,
      end_date: dateRange.to,
      user_id: user.id,
    };

    if (discType === "MANUAL") {
      payload.valueType = valueType;
      payload.discAmount = Number(discAmount);
    }

    if (discType === "MIN_PURCHASE") {
      payload.minPurch = Number(minPurch);
      payload.valueType = valueType;
      payload.discAmount = Number(discAmount);
    }

    console.log("Payload to submit:", payload);

    try {
      const res = await apiCall.post("/api/discount/new", { data: payload });
      if (!res) return;
      toast.success("Create New Discount Success");
      setOpen(false);
      window.location.reload();
      // reset form
      setDiscType("");
      setSelectedStore("");
      setSelectedProduct("");
      setDiscountCode("");
      setValueType("");
      setDiscAmount("");
      setMinPurch("");
      setDateRange({ from: undefined, to: undefined });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* Header */}
        <DialogHeader className="flex justify-between">
          <div>
            <DialogTitle>Create New Discount</DialogTitle>
          </div>
          <Select
            value={selectedStore}
            onValueChange={setSelectedStore}
            disabled={user.role === "STORE_ADMIN"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              {storesData.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogHeader>

        <form
          id="create-discount"
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          {/* Discount Name */}
          <div>
            <label>Discount Name</label>
            <Input name="name" placeholder="Discount Name" autoComplete="off" />
          </div>

          {/* Discount Type */}
          <div>
            <label>Discount Type</label>
            <Select value={discType} onValueChange={setDiscType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL">Manual per Product</SelectItem>
                <SelectItem value="MIN_PURCHASE">
                  Minimum Total Payment (Rp)
                </SelectItem>
                <SelectItem value="B1G1">Buy One Get One</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Code & Date */}
          <div className="flex gap-2 items-center">
            <Input
              value={discountCode}
              onChange={(e) =>
                setDiscountCode(e.target.value.toUpperCase().trim())
              }
              placeholder="Discount Code"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {dateRange.from && dateRange.to
                    ? `${formatIntlDate(dateRange.from)} - ${formatIntlDate(dateRange.to)}`
                    : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <DatePicker range={dateRange} setRange={setDateRange} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Conditional Fields */}
          {discType === "MANUAL" && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label>Value Type</label>
                <Select
                  value={valueType.toUpperCase()}
                  onValueChange={setValueType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Value Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="NOMINAL">Nominal (Rp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label>Amount</label>
                <Input
                  type="number"
                  value={discAmount}
                  onChange={(e) => setDiscAmount(e.target.value)}
                />
              </div>
            </div>
          )}

          {discType === "MIN_PURCHASE" && (
            <div>
              <label>Minimum Total Payment (Rp)</label>
              <Input
                type="number"
                value={minPurch}
                onChange={(e) => setMinPurch(e.target.value)}
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label>Value Type</label>
                  <Select
                    value={valueType.toUpperCase()}
                    onValueChange={setValueType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Value Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="NOMINAL">Nominal (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label>Amount</label>
                  <Input
                    type="number"
                    value={discAmount}
                    onChange={(e) => setDiscAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product List (always visible) */}
          <div>
            <label>Product List</label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={!selectedStore}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productByStore.map((prd) => (
                    <SelectItem key={prd.id} value={prd.id.toString()}>
                      {prd.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <Textarea name="description" />
          </div>
        </form>

        <DialogFooter className="flex gap-2">
          <Button form="create-discount">Submit</Button>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => {
                setDiscType("");
                setSelectedStore("");
                setSelectedProduct("");
                setDiscountCode("");
                setValueType("");
                setDiscAmount("");
                setMinPurch("");
                setDateRange({ from: undefined, to: undefined });
              }}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
