import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IStoreProps } from "@/types/store";
import { IUserProps } from "@/types/user";;
import Image from "next/image";

interface IStoreAdminList {
  open: boolean;
  setOpen: (value: boolean) => void;
  store: IStoreProps;
}

export default function StoreAdminList({
  open,
  setOpen,
  store,
}: IStoreAdminList) {
  const handlerWhatsapp = (admin: IUserProps) => {
    const waUrl = `https://wa.me/${admin.phone}`;
    window.open(waUrl);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Store Admin List</DialogTitle>
              <DialogDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quaerat, commodi?
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Admin Name</TableHead>
                  <TableHead className="text-center">Phone</TableHead>
                  <TableHead className="text-center">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.admins?.map((admin) => (
                  <TableRow key={admin.id} className="text-center">
                    <TableCell>
                      {admin.first_name} {admin.last_name}
                    </TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-x-1">
                        <Button
                          className="bg-green-500 hover:bg-green-600 cursor-pointer"
                          onClick={() => handlerWhatsapp(admin)}
                        >
                          <Image
                            src={"/assets/waicon.png"}
                            alt="icon"
                            width={50}
                            height={50}
                            className="size-5 p-0"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </form>
      </Dialog>
      {/* Delete Dialog */}
    </>
  );
}
