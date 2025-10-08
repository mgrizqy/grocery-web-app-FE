import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IStoreProps } from "@/types/store";
import { Check, Store, Trash, Users, X } from "lucide-react";
import { useState } from "react";
import StoreAdminList from "./btndetails/StoreAdmin";
import StoreDetailsDialog from "./btndetails/StoreDetailsDialog";

interface IStoreCard {
  className?: string;
  stores: IStoreProps[];
}

export default function StoreCardStacks({ stores, className }: IStoreCard) {
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

  const handlerDelete = (data: IStoreProps) => {
    if (!data) return;
    console.log(data);
  };

  return (
    <div
      className={`${className} lg:hidden grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2`}
    >
      {stores.map((store) => {
        return (
          <Card key={store.id} className="p-1">
            <CardContent className="flex items-center gap-x-2 p-2">
              {/* <div id="storelogo">
                <div className="relative w-25 h-25 rounded-md overflow-hidden">
                  <Image
                    src={"https://picsum.photos/id/237/500/300"}
                    alt="store-banner"
                    fill
                    className="object-cover"
                  />
                </div>
              </div> */}
              <div className="flex flex-col">
                <div id="profile">
                  <p className="font-semibold">{store.name}</p>

                  {store.is_active ? (
                    <Badge className="bg-green-500">
                      <Check />
                      Store Active
                    </Badge>
                  ) : (
                    <Badge variant={"destructive"}>
                      <X />
                      Store Inactive
                    </Badge>
                  )}

                  <p className="text-xs">
                    {store.city},{store.province}
                  </p>

                  <p className="text-xs">
                    Admin : {store.admins?.length} Admin{" "}
                  </p>
                </div>
                <div id="button" className="flex gap-x-1">
                  <Button
                    className="h-8 bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => setSelectedAdminStore(store)}
                  >
                    <Users />
                  </Button>
                  <Button
                    className="h-8 rounded-md bg-blue-500 hover:bg-blue-600"
                    onClick={() => setSelectedStore(store)}
                  >
                    <Store />
                  </Button>
                  <Button
                    className="h-8 rounded-md bg-red-500/80"
                    onClick={() => btnDelete(store)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
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

      {/* Store Admin List */}
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
