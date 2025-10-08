"use client";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import PaginationControls from "@/components/PaginationControls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IUserProps } from "@/types/user";
import { BadgeAlert, BadgeCheckIcon, FileSearch, Trash } from "lucide-react";
import { useState } from "react";
import UserDetailsDialog from "./btndetails/UserDetailsDialog";
import { toast } from "react-toastify";
import { IStoreProps } from "@/types/store";

interface IUsersDataCardStacks {
  users: IUserProps[];
  stores: IStoreProps[];
}

export default function UsersDataCardStacks({
  users,
  stores,
}: IUsersDataCardStacks) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IUserProps | null>(null);
  const usersPerPage = 2;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const [deleteSelectedUser, setDeleteSelectedUser] =
    useState<IUserProps | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const btnDelete = (user: IUserProps) => {
    setDeleteSelectedUser(user);
    setDeleteConfirm((prev) => !prev);
  };

  const handlerDelete = (data: IUserProps) => {
    if (!data) return;
    // console.log(data);
    toast.success("Delete Data Success");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]  gap-2 lg:hidden">
      {currentUsers.map((user) => (
        <Card key={user.id} className="p-1 rounded-sm">
          <CardContent className="flex items-center  gap-x-2  p-0.5">
            <div id="avatar">
              <Avatar className="size-12">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                ></AvatarImage>
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </div>
            <div id="user-profile">
              <div id="name-and-verify" className="flex flex-col gap-x-1">
                <p className="text-md font-semibold">
                  {user.first_name} {user.last_name}
                </p>
                {user.is_verified ? (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white dark:bg-blue-600 text-xs"
                  >
                    <BadgeCheckIcon />
                    <p className="text-2xs">Verified</p>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-400 text-white dark:bg-blue-600 text-xs"
                  >
                    <BadgeAlert />
                    <p className="">Unverified</p>
                  </Badge>
                )}
              </div>
              <p className="text-xs my-1">{user.email}</p>
              <div id="btn" className="flex gap-x-2">
                <Button
                  className="h-8 rounded-md"
                  variant={"outline"}
                  onClick={() => setSelectedUser(user)}
                >
                  <FileSearch />
                </Button>
                <Button
                  className="h-8 rounded-md"
                  variant={"destructive"}
                  onClick={() => btnDelete(user)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="mt-10">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* User Details Dialog */}
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
      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteConfirm}
        setOpen={setDeleteConfirm}
        data={deleteSelectedUser}
        onConfirm={handlerDelete}
      />
    </div>
  );
}
