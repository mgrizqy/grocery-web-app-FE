"use client";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { IUserProps } from "@/types/user";
import { FileSearch, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserDetailsDialog from "./btndetails/UserDetailsDialog";
import UsersDataCardStacks from "./CardStacksUsersData";
import { IStoreProps } from "@/types/store";
interface Props {
  className?: string;
  customers: IUserProps[];
  stores: IStoreProps[];
}

export default function CustomerTable({ className, customers, stores }: Props) {
  const [userList, setUserList] = useState<IUserProps[]>(customers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "verified" | "unverified">("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteUser, setDeleteUser] = useState<IUserProps | null>(null);

  const usersPerPage = 5;

  const filtered = userList.filter((u) =>
    [u.first_name, u.email, u.id].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = status === "all"
    ? filtered
    : filtered.sort((a, b) =>
        status === "verified"
          ? Number(b.is_verified) - Number(a.is_verified)
          : Number(a.is_verified) - Number(b.is_verified)
      );

  const currentUsers = sorted.slice((page - 1) * usersPerPage, page * usersPerPage);

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await apiCall.delete(`/api/user/${deleteUser.id}`);
      setUserList((prev) => prev.filter((u) => u.id !== deleteUser.id));
      toast.success("Delete success");
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirmDelete(false);
    }
  };

  useEffect(() => {
    setUserList(customers);
  }, [customers]);

  return (
    <>
      <Card className={className}>
        <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
          <h1 className="text-xl font-semibold">Registered Customers</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-60">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="text-sm"
              />
              <Search className="absolute size-4 top-2.5 right-2 text-gray-400" />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger><SelectValue placeholder="Filter" /></SelectTrigger>
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
        </CardHeader>

        <CardContent>
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow>
                {["First", "Last", "Phone", "Email", "Status", "Action"].map((t) => (
                  <TableHead key={t} className="text-center">{t}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((u) => (
                <TableRow key={u.id} className="text-center">
                  <TableCell>{u.first_name}</TableCell>
                  <TableCell>{u.last_name}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.is_verified ? "Verified" : "Unverified"}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button onClick={() => setSelectedUser(u)} className="bg-blue-500">
                      <FileSearch className="text-white" />
                    </Button>
                    <Button variant="destructive" onClick={() => {
                      setDeleteUser(u);
                      setConfirmDelete(true);
                    }}>
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Mobile View */}
          <UsersDataCardStacks users={currentUsers} stores={stores} />
        </CardContent>

        <CardFooter className="hidden lg:flex justify-end">
          <PaginationControls
            currentPage={page}
            totalPages={Math.ceil(sorted.length / usersPerPage)}
            onPageChange={setPage}
          />
        </CardFooter>
      </Card>

      {/* Modals */}
      {selectedUser && (
        <UserDetailsDialog
          open={!!selectedUser}
          setOpen={(open) => !open && setSelectedUser(null)}
          users={selectedUser}
          stores={stores}
        />
      )}
      <ConfirmDeleteDialog
        open={confirmDelete}
        setOpen={setConfirmDelete}
        data={deleteUser}
        onConfirm={handleDelete}
      />
    </>
  );
}
