"use client";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
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
import { apiCall } from "@/helper/apiCall";
import { IUserProps } from "@/types/user";
import { FileSearch, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserDetailsDialog from "./btndetails/UserDetailsDialog";
import UsersDataCardStacks from "./CardStacksUsersData";
import { IStoreProps } from "@/types/store";
interface IUsersTable {
  className?: string;
  customers: IUserProps[];
  stores: IStoreProps[];
}

export default function CustomerTable({
  className,
  customers,
  stores,
}: IUsersTable) {
  const [userList, setUserList] = useState<IUserProps[]>(customers);
  // console.log(userList);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const filteredUsers = userList.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!orderStatus) return 0;
    if (orderStatus === "verified") {
      return Number(b.is_verified) - Number(a.is_verified);
    }
    if (orderStatus === "unverified") {
      return Number(a.is_verified) - Number(b.is_verified);
    }
    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const [deleteSelectedUser, setDeleteSelectedUser] =
    useState<IUserProps | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const usersPerPage = 5;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const btnDelete = (user: IUserProps) => {
    setDeleteSelectedUser(user);
    setDeleteConfirm((prev) => !prev);
  };
  const handlerDelete = async (data: IUserProps) => {
    if (data) {
      const userId = data.id;
      console.log(userId);
      try {
        const res = await apiCall.delete(`/api/user/${userId}`);
        console.log(res);
        toast.success("Delete User Data Success");
        setUserList((prev) => prev.filter((user) => user.id !== data.id));
        setDeleteConfirm(false);
      } catch (error) {
        console.log(error);
        alert("eror bos");
      }
    }
  };

  useEffect(() => {
    setUserList(customers);
  }, [customers]);
  return (
    <>
      <Card className={`${className} `}>
        <CardHeader className="flex max-lg:flex-col items-center justify-between ">
          <div className="w-full">
            <h1 className="font-semibold text-xl">Registered Customers</h1>
          </div>
          <div className="flex max-lg:flex-col gap-x-2 w-full ">
            <div id="searcbar" className="relative w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by first/last name or email."
                className="text-xs"
              ></Input>
              <Search className="absolute size-4 top-2.5 right-2 text-gray-400" />
            </div>
            <div className="flex gap-x-2 max-lg:justify-between max-lg:mt-5">
              <div id="filter">
                <Select
                  value={orderStatus}
                  onValueChange={(value) =>
                    setOrderStatus(value as "all" | "verified" | "unverified")
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Order By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="verified">Verified✅</SelectItem>
                      <SelectItem value="unverified">Unverified⚠️</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className=" p-4
        "
        >
          {/* Desktop Version - Table */}
          <Table className="max-lg:hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">First Name</TableHead>
                <TableHead className="text-center">Last Name</TableHead>
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center max-xl:hidden">
                  Status
                </TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="">{user.email}</TableCell>
                  <TableCell className="max-xl:hidden">
                    {user.is_verified ? "Verified" : "Unverified"}
                  </TableCell>
                  <TableCell className="flex gap-x-2 items-center text-center justify-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600
                  "
                      onClick={() => setSelectedUser(user)}
                    >
                      <FileSearch className="text-white" />
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => btnDelete(user)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Mobile Version - Card Stacks */}
          <UsersDataCardStacks users={currentUsers} stores={stores} />
        </CardContent>
        <CardFooter className="max-lg:hidden">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
      {/* UserDetails Dialog */}
      {selectedUser && (
        <UserDetailsDialog
          open={!!selectedUser}
          setOpen={(open) => {
            if (!open) setSelectedUser(null);
          }}
          users={selectedUser}
          stores={stores}
        />
      )}
      {/* Confirm Details  */}
      <ConfirmDeleteDialog
        open={deleteConfirm}
        setOpen={setDeleteConfirm}
        data={deleteSelectedUser}
        onConfirm={handlerDelete}
      />
    </>
  );
}
