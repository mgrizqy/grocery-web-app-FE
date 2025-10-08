"use client";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/auth-store";
import { useDiscountStore } from "@/store/useDiscount";
import { useStore } from "@/store/useStore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreateNewDiscount from "./components/CreateNewDisc";
import DiscountHistory from "./components/DiscountHistory";
import SummaryDiscountCard from "./components/SummaryDiscountCard";

export default function DiscountPage() {
  // const [discountData, setDiscountData] = useState([]);
  const { selectedStore, setSelectedStore } = useStore();
  const { user } = useAuthStore();
  const [createDiscount, setCreateDiscount] = useState(false);
  const setDiscounts = useDiscountStore((state) => state.setDiscounts);
  // filter
  const [discountType, setDiscountType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getAllDiscount = async () => {
    try {
      const res = await apiCall.get("/api/discount/all");
      const data = res.data.data;
      // console.log(data);
      // setDiscountData(data);
      setDiscounts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDiscount();
    if ((user.role === "STORE_ADMIN" || "SUPER_ADMIN") && user.store_id) {
      setSelectedStore(user.store_id.toString());
    }
  }, []);
  return (
    <DashboardLayout>
      <section className="py-5">
        <section className="bg-white w-full  rounded-md shadow-sm p-5">
          <section
            id="header"
            className="flex max-md:flex-col items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-semibold">
                Discount Management Page
              </h1>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Numquam, dolore.
              </p>
            </div>
            <div id="btn" className="flex gap-x-2 mt-5">
              {/* <Button>
                <Download /> Export History
              </Button> */}
              <Button
                onClick={() => setCreateDiscount((prev) => !prev)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus /> Create New Discount
              </Button>
            </div>
          </section>
          <SummaryDiscountCard
            discountType={discountType}
            searchQuery={searchQuery}
          />
          <DiscountHistory
            discountType={discountType}
            setDiscountType={setDiscountType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </section>
      </section>
      {/* Create New Discount */}
      <CreateNewDiscount
        open={createDiscount}
        setOpen={setCreateDiscount}
        onCreate={(newDiscount) =>
          setDiscounts((prev) => [newDiscount, ...prev])
        }
      />
    </DashboardLayout>
  );
}
