import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/auth-store";
import { IStockProps } from "@/types/stock";
import { useEffect, useState } from "react";
interface IEditStockProduct {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedProduct: IStockProps | null;
}

export default function EditStockProduct({
  open,
  setOpen,
  selectedProduct,
}: IEditStockProduct) {
  // console.log(selectedProduct);
  const [stockProductDetail, setStockProductDetail] = useState(selectedProduct);
  const [stockType, setStockType] = useState("");
  const [minStock, setMinStock] = useState<number>(
    selectedProduct?.min_stock ?? 0
  );
  const user_id = useAuthStore((state) => state.user).id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason");
    const product_id = selectedProduct?.product.id;
    const store_id = selectedProduct?.store.id;
    const updated_stock = Number(formData.get("quantity") || 0);
    const prev_qty = selectedProduct?.stock_quantity ?? 0;
    if (stockType === "IN" && updated_stock < prev_qty) {
      alert("Wrong Change Type Selection");
      return;
    } else if (stockType === "OUT" && updated_stock > prev_qty) {
      alert("Wrong Change Type Selection");
      return;
    }

    if (!stockType) {
      alert("Please select Change Type");
      return;
    }
    if (!minStock && minStock !== 0) {
      alert("Minimum Stock cannot be empty");
      return;
    }
    if (!reason) {
      alert("Change Product Stock reason cannot be empty");
      return;
    }

    const payload = {
      user_id,
      product_id,
      store_id,
      type: stockType,
      prev_qty,
      updated_stock,
      min_stock: minStock,
      reason,
    };
    const res = await apiCall.post(
      `/api/stock/change-stock/store/${store_id}`,
      payload
    );
    alert("Success Update Stock");
    window.location.reload();
  };

  useEffect(() => {
    setStockProductDetail(selectedProduct);
    setMinStock(selectedProduct?.min_stock ?? 0);
  }, [selectedProduct]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Product Stock</DialogTitle>
          <DialogDescription>
            Change your current stock with actual stock
          </DialogDescription>
        </DialogHeader>
        {/* Content */}
        <section>
          <form id="edit-stock" onSubmit={handleSubmit}>
            <div className="flex">
              <label className="w-full">Product Name</label>
              <Input
                className=""
                value={stockProductDetail?.product.name}
                disabled
              />
            </div>
            <div className="flex gap-x-3 items-center my-5">
              <div className="flex items-center w-full">
                <label className="w-full">Change Type</label>
                <Select
                  value={stockType}
                  onValueChange={(value) => setStockType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Change Type</SelectLabel>
                      <SelectItem value="IN">Stock IN</SelectItem>
                      <SelectItem value="OUT">Stock OUT</SelectItem>
                      {/* <SelectItem value="ADJUSTMENT">Adjustment</SelectItem> */}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-x-5 items-center">
              <div className="w-full">
                <label>Update Actual Stock (pcs)</label>
                <Input type="number" name="quantity" placeholder="00" />
              </div>
              <div className="w-full">
                <label>Minimum Stock (pcs)</label>
                <Input
                  // type="number"
                  placeholder="00"
                  // name="min_stock"
                  value={minStock}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label>Reason:</label>
              <Textarea name="reason"></Textarea>
            </div>
          </form>
        </section>
        <DialogFooter>
          <Button type="submit" form="edit-stock">
            Submit
          </Button>
          <DialogClose asChild>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
