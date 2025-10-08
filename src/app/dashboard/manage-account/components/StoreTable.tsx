import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IStoreProps } from "@/types/store";
import { FileSearch, Trash, Users } from "lucide-react";
import { useEffect, useState } from "react";
import StoreDetailsDialog from "./btndetails/StoreDetailsDialog";
import StoreAdminList from "./btndetails/StoreAdmin";
import { toast } from "react-toastify";
import { apiCall } from "@/helper/apiCall";

interface IStoreTable {
  className?: string;
  stores: IStoreProps[];
}

export default function StoreTable({ className, stores }: IStoreTable) {
  const [storesList, setStoreList] = useState<IStoreProps[]>(stores);
  const [deleteSelectedStore, setDeleteSelectedStore] =
    useState<IStoreProps | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStoreProps | null>(null);
  const [selectedAdminStore, setSelectedAdminStore] =
    useState<IStoreProps | null>(null);

  const btnDelete = (store: IStoreProps) => {
    setDeleteSelectedStore(store);
    setDeleteConfirm((prev) => !prev);
  };

  const handlerDelete = async (data: IStoreProps) => {
    const storeId = data.id;
    try {
      const deleteStore = await apiCall.delete(`/api/store/${storeId}`); // delete store

      if (deleteStore) {
        toast.success("Delete Store and Revert Admin Success");
        setStoreList((prev) => prev.filter((store) => store.id !== data.id));
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("error bos");
    }
  };

  useEffect(() => {
    setStoreList(stores);
  }, [stores]);

  return (
    <div className={`${className} max-lg:hidden`}>
      <Table className="max-lg:hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">City</TableHead>
            <TableHead className="text-center">Province</TableHead>
            <TableHead className="text-center">Address</TableHead>
            <TableHead className="text-center">Total Admin</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {storesList.map((store) => (
            <TableRow key={store.id}>
              <TableCell className="">{store.name}</TableCell>
              <TableCell className="">{store.city}</TableCell>
              <TableCell>{store.province}</TableCell>

              <TableCell>{store.address}</TableCell>
              <TableCell>{store.admins?.length}</TableCell>
              <TableCell className="">
                {store.is_active ? "Active" : "Inactive"}
              </TableCell>
              <TableCell className="flex gap-x-2 items-center text-center justify-center">
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => setSelectedAdminStore(store)}
                >
                  <Users />
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600
                        "
                  onClick={() => setSelectedStore(store)}
                >
                  <FileSearch className="text-white" />
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => btnDelete(store)}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Details Dialog */}
      {selectedStore && (
        <StoreDetailsDialog
          open={!!selectedStore}
          setOpen={(open) => {
            if (!open) setSelectedStore(null);
          }}
          store={selectedStore}
        />
      )}

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteConfirm}
        setOpen={setDeleteConfirm}
        data={deleteSelectedStore}
        onConfirm={handlerDelete}
      />

      {/* Store Admin List  */}
      {selectedAdminStore && (
        <StoreAdminList
          open={!!selectedAdminStore}
          setOpen={(open) => {
            if (!open) setSelectedAdminStore(null);
          }}
          store={selectedAdminStore}
        />
      )}
    </div>
  );
}
