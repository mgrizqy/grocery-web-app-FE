import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { IStoreProps } from "@/types/store";
import { IUserProps } from "@/types/user";
import { IUserAddressProps } from "@/types/user_address";

interface IUserDetailsDialog {
  open: boolean;
  setOpen: (value: boolean) => void;
  users: IUserProps;
  stores: IStoreProps[];
}
export default function UserDetailsDialog({
  open,
  setOpen,
  users,
}: IUserDetailsDialog) {
  console.log(users);
  const main_address =
    users.addresses?.find((addr: IUserAddressProps) => addr.is_primary)
      ?.street ?? "";
  const first_name = users.first_name;
  const last_name = users.last_name;
  const email = users.email;
  const phone = users.phone;
  const city = users.addresses?.find(
    (addr: IUserAddressProps) => addr.city
  )?.city;
  const province = users.addresses?.find(
    (addr: IUserAddressProps) => addr.province
  )?.province;
  const profilePic = users.image_url;
  let full_address = main_address + ", " + city + ", " + province;
  if (!main_address) {
    full_address = (city ?? "") + (province ?? "");
  }

  // const [openStoreSelect, setOpenStoreSelect] = useState(false);
  // const [selectedStore, setSelectedStore] = useState<string | undefined>(
  //   undefined
  // );
  // assign admin handler
  // const handlerAssignAdmin = async (userId: string, storeId: string) => {
  //   if (!storeId) return alert("You have to choose the store");
  //   try {
  //     const id = userId;
  //     const store_id = parseInt(storeId);
  //     const res = await apiCall.patch(`/api/user/new-admin/${id}`, {
  //       store_id,
  //     });
  //     if (res && res.data.success) {
  //       toast.success("Assign Admin Success");
  //       setOpen(false);
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {/* Avatar */}
        <div className="relative flex justify-center items-center cursor-pointer">
          <Avatar className="size-15">
            <AvatarImage className="" src={profilePic} />
            <AvatarFallback>ID</AvatarFallback>
          </Avatar>
        </div>
        {/* Content */}
        <form>
          <div className="flex max-sm:flex-col gap-x-2 w-full">
            <div id="first_name" className="w-full">
              <label className="max-md:text-sm">First Name</label>
              <Input value={first_name} disabled className="max-md:text-sm" />
            </div>
            <div id="last_name" className="w-full">
              <label className="max-md:text-sm">Last Name</label>
              <Input disabled value={last_name} className="max-md:text-sm" />
            </div>
          </div>
          <div className="flex gap-x-1 max-sm:flex-col">
            <div id="email" className="w-full">
              <label className="max-md:text-sm">Email</label>
              <Input disabled value={email} className="max-md:text-sm" />
            </div>
            <div id="phone" className="w-full">
              <label className="max-md:text-sm">Phone Number</label>
              <Input disabled value={phone ?? ""} />
            </div>
          </div>
          <div className="flex gap-x-1">
            <div id="address" className="w-full">
              <label className="max-md:text-sm">Main Address</label>
              <Input
                disabled
                value={full_address ?? ""}
                className="max-md:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-x-1">
            <div id="status" className="w-full">
              <label className="max-md:text-sm"> Status</label>
              <Input
                disabled
                value={users.is_verified ? "✅ Verified" : "⚠️Unverified"}
                className="max-md:text-sm"
              />
            </div>
            <div id="referral-code" className="w-full">
              <label className="max-md:text-sm">Referral Code</label>
              <Input
                disabled
                defaultValue={users.referralCode}
                className="max-md:text-sm"
              />
            </div>
          </div>
        </form>
        {/* Footer */}
        <DialogFooter>
          {/* Store Selection for Assign Admin */}
          {/* {!openStoreSelect ? (
            <>
              {users.is_verified === false && (
                <Button>
                  <Mail /> Send Verification
                </Button>
              )}
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setOpenStoreSelect(true)}
              >
                <User />
                Assign as Admin
              </Button>
            </>
          ) : (
            <div className="flex flex-col md:flex-row md:gap-3">
              <div className="flex items-center">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Store List</SelectLabel>
                      {stores.map((store, idx) => (
                        <div key={idx}>
                          <SelectItem value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        </div>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center gap-x-3  mt-2">
                <div>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() =>
                      handlerAssignAdmin(users.id, selectedStore ?? "")
                    }
                  >
                    Assign Admin
                  </Button>
                </div>
                <div>
                  <Button
                    variant={"destructive"}
                    onClick={() => setOpenStoreSelect(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
