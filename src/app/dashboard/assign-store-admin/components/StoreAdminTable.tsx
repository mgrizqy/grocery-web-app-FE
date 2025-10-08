import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardFooter,CardHeader,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem,SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import { MapPinPen, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import RelocateAdmin from "./btndetails/RelocateAdmin";
import { IRelocateAdminData } from "@/types/relocate_admin";
import { IUserProps } from "@/types/user";

interface IStoreAdminData {
  className?: string;
  storeAdmins: { withStore: IStoreProps[]; withoutStore: IUserProps[];};
}

export default function StoreAdminData({
  className,
  storeAdmins,
}: IStoreAdminData) {
  const storeAdminData = [
    ...(storeAdmins?.withStore?.flatMap(
      (store) =>
        store.admins?.map((admin) => ({
          adminId: admin.id,
          adminFirstName: admin.first_name,
          adminLastName: admin.last_name,
          storeName: store.name,
          adminRole: admin.role,
          storeId: store.id,
          adminPhone: admin.phone,
        })) ?? []
    ) ?? []),
    ...(storeAdmins?.withoutStore?.map((admin) => ({
      adminId: admin.id,
      adminFirstName: admin.first_name,
      adminLastName: admin.last_name,
      storeName: "No Store",
      adminRole: admin.role,
      storeId: null,
      adminPhone: admin.phone,
    })) ?? []),
  ];
  const storeList = storeAdmins?.withStore?.map((store) => ({ id: store.id, name: store.name,})) ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const filteredAdmin = storeAdminData.filter((admin) => {
    const matchesSearch =
      admin?.adminFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.adminLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStore = !selectedStore || admin?.storeName === selectedStore;
    return matchesSearch && matchesStore;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredAdmin.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAdmin.length / usersPerPage);

  const handlerRevertAdmin = async (
    id: string, role: string, store_id: number
  ) => {
    try {
      const confirmAlert = confirm("Are you sure revert this store admin?");
      if (!confirmAlert) return;
      const res = await apiCall.patch(`/api/user/revert-admin/${id}`, {
        role,store_id,
      });
      if (!res) toast.error("Revert Store Admin Error");
      toast.success("Revert Admin Success");
      window.location.reload();
    } catch (error) {
      toast.error("error");
    }
  };
  // change store
  const [openStoreTf, setOpenStoreTf] = useState<{ adminData: IRelocateAdminData | null; storeList: { id: number; name: string }[]; open: boolean;}>({ adminData: null,storeList: storeList,open: false,});

  return (
    <div>
      <Card className={`${className} `}>
        <CardHeader className="flex flex-col max-lg:flex-col  ">
          <div className=" flex w-full">
            <div id="title" className="w-full">
              <h1 className="font-semibold text-xl">Store Admin</h1>
            </div>
            <div id="btn" className="flex gap-x-2">
              <div id="filter" className="w-full">
                <Select
                  value={selectedStore ?? ""}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedStore("");
                    } else {
                      setSelectedStore(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Store Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Stores</SelectLabel>
                      <SelectItem value="all">ALL STORES</SelectItem>
                      {storeList.map((store) => (
                        <SelectItem key={store.id} value={store.name}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex max-lg:flex-col gap-x-2 w-full "></div>
          <div id="searcbar" className="relative w-full">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name"
              className="text-xs w-full"
            ></Input>
            <Search className="absolute size-4 top-2.5 right-2 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent
          className=" p-4
        "
        >
          {/* Desktop Version - Table */}
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">First Name</TableHead>
                <TableHead className="text-center">Last Name</TableHead>
                <TableHead className="text-center">Store Name</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {currentUsers.map((admin, idx) => (
                <TableRow key={idx}>
                  <TableCell>{admin?.adminFirstName}</TableCell>
                  <TableCell>{admin?.adminLastName}</TableCell>
                  <TableCell>{admin?.storeName}</TableCell>
                  <TableCell className="flex gap-x-2 items-center text-center justify-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600
                  "
                      onClick={() =>
                        setOpenStoreTf({
                          adminData: { adminId: admin?.adminId, storeId: admin?.storeId ?? 0, storeName: admin?.storeName,},
                          storeList: storeList,
                          open: true,
                        })
                      }
                    >
                      <MapPinPen className="text-white" />
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => handlerRevertAdmin( admin?.adminId ?? "", admin?.adminRole ?? "CUSTOMER", admin?.storeId ?? 0) }>
                      <RotateCcw />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="max-lg:hidden">
          {/* Pagination */}
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
          {/* Dialog Change Store */}
          <RelocateAdmin
            open={openStoreTf.open}
            setOpen={(val) =>
              setOpenStoreTf((prev) => ({
                ...prev,
                open: val,
              }))
            }
            adminData={openStoreTf.adminData}
            storeList={storeList}
          />
        </CardFooter>
      </Card>
    </div>
  );
}