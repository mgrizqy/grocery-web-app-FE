import { IUserAddressProps } from "./user_address";

export interface IUserProps {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN";
  is_verified?: boolean;
  image_url: string;
  bio: string;
  password: string;
  city?: string;
  province?: string;
  postalCode?: string;
  addresses?: IUserAddressProps[];
  store?: string;
  storename?: string;
  storestatus?: boolean;
  profilePic?: string | File | null;
  socialLogin?: string;
  referralCode?: string;
  isVerified?: boolean;
  date_of_birth: Date;
  store_id: number;
}
