import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IStoreProps } from "@/types/store";
import { Edit, Search, Trash } from "lucide-react";
import { useState } from "react";
import NewStoreAdmin from "./btndetails/NewStoreAdmin";
import { IUserProps } from "@/types/user";
import { apiCall } from "@/helper/apiCall";
import EditStoreAdmin from "./btndetails/EditStoreAdmin";

interface IStoreAdminData {
  className?: string;
  storeAdmins: {
    withStore: IStoreProps[];
    withoutStore: IUserProps[];
  };
}

export default function StoreAdminData({
  className,
  storeAdmins,
}: IStoreAdminData) {
  const [openNewAdmin, setOpenNewAdmin] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);
  const [selectedStoreAdmin, setSelectedStoreAdmin] = useState("");
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
  const storeList =
    storeAdmins?.withStore?.map((store) => ({
      id: store.id,
      name: store.name,
    })) ?? [];
  // search query - search bar
  const [searchQuery, setSearchQuery] = useState("");
  // filter store
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const filteredAdmin = storeAdminData.filter((admin) => {
    const matchesSearch =
      admin?.adminFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.adminLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.storeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStore = !selectedStore || admin?.storeName === selectedStore;
    return matchesSearch && matchesStore;
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredAdmin.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAdmin.length / usersPerPage);

  // soft delete methods
  const deleteStoreAdmin = async (id: string) => {
    const confirm = window.confirm("Are you sure delete this store admin?");
    if (!confirm) return;
    try {
      const user_id = id;
      await apiCall.patch(`/api/user/${user_id}`);
      alert("Delete store admin success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card className={`${className} `}>
        <CardHeader className="flex flex-col max-lg:flex-col  ">
          <div className=" flex w-full">
            <div id="title" className="w-full">
              <h1 className="font-semibold text-xl">Store Admin</h1>
            </div>
            <div id="btn" className="flex gap-x-2">
              <div id="new-sa">
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => setOpenNewAdmin(true)}
                >
                  New Store Admin
                </Button>
              </div>
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
                      <SelectItem value="No Store">No Store</SelectItem>
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
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {currentUsers.map((admin, idx) => (
                <TableRow key={idx}>
                  <TableCell>{admin?.adminFirstName}</TableCell>
                  <TableCell>{admin?.adminLastName}</TableCell>
                  <TableCell>
                    {admin?.storeName ? admin.storeName : <p>No Store</p>}
                  </TableCell>
                  <TableCell>{admin?.adminPhone}</TableCell>
                  <TableCell className="flex gap-x-2 items-center text-center justify-center">
                    <Button
                      onClick={() => {
                        setSelectedStoreAdmin(admin?.adminId ?? "");
                        setOpenEditAdmin(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteStoreAdmin(admin?.adminId ?? "")}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="max-lg:hidden">
          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
      {/* New Store Admin */}
      <NewStoreAdmin
        open={openNewAdmin}
        setOpen={setOpenNewAdmin}
        storeList={storeList}
      />
      {/* Edit Store Admin  */}
      <EditStoreAdmin
        open={openEditAdmin}
        setOpen={setOpenEditAdmin}
        selectedUser={selectedStoreAdmin}
        storeList={storeList}
      />
    </div>
  );
}
