import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useProduct } from "@/store/useProduct";
import { IProductProps } from "@/types/product";
import { formatIDRCurrency, upperFirstCharacter } from "@/utils/format";
import Autoplay from "embla-carousel-autoplay";
import { Headset, MapPin, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

interface IDesktopPrdDetails {
  allProduct: IProductProps[] | null;
  className?: string;
}
export default function DesktopPrdDetails({
  // detailsData,
  className,
}: IDesktopPrdDetails) {
  const {
    selectedProductDetails,
    productsByLoc,
    getProductById,
    setSelectedProductDetails,
  } = useProduct();
  const { addItem, items: cartItems } = useCartStore();
  const { user } = useAuthStore();

  // case untuk fetch data ulang (bila ada perubahan data stock/keterangan lain di dashboard)
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  const filteredCategory = productsByLoc?.filter(
    (p) => p.category.category === selectedProductDetails?.category.category
  );

  // increment/decrement purchasement handler
  const [value, setValue] = useState(1);
  const handlerValue = (type: "inc" | "dec") => {
    if (type === "inc") {
      setValue((prev) => prev + 1);
    } else if (type === "dec" && value > 1) {
      setValue((prev) => prev - 1);
    }
  };

  const itemInCart = cartItems.find(
    (item) => item.productId === selectedProductDetails?.id
  );
  const quantityInCart = itemInCart?.quantity || 0;

  // prd preview handler
  const [preview, setPreview] = useState("");
  const handlerPreview = (img: string) => {
    setPreview(img);
  };
  // image
  const mainImage = selectedProductDetails?.images.map(
    (image) => image.image_url
  )[0];
  const images = selectedProductDetails?.images;

  // Stock handler
  const stock = selectedProductDetails?.stocks.map(
    (stock) => stock.stock_quantity
  )[0];
  const isOutOfStock = stock === 0;
  const isLowStock = stock && stock <= 5;
  // Store
  const storeIdentity = selectedProductDetails?.stocks?.[0]?.store
    ? {
        name: selectedProductDetails.stocks[0].store.name,
        city: selectedProductDetails.stocks[0].store.city,
        province: selectedProductDetails.stocks[0].store.province,
      }
    : null;

  return (
    <section className={`${className}  `}>
      <section
        id="details"
        className="flex gap-x-10 2xl:gap-x-20 mt-10 px-10 xl:px-40 2xl:px-60  items-center   "
      >
        <div id="prd-picture" className="w-full 2xl:w-[60%] mt-10 ">
          <div
            id="preview"
            className="relative w-full h-70 lg:h-80 xl:h-90  rounded-lg overflow-hidden shadow-md  "
          >
            <Image
              src={preview || mainImage || "/assets/fallback.png"}
              alt="prd-picture"
              fill
              className="object-cover"
            />
          </div>
          <div
            id="prdPic-carousel"
            className="grid grid-cols-4 gap-x-2 xl:gap-x-4 my-3"
          >
            {images?.map((img, index) => (
              <div
                className="relative w-full h-15 lg:h-20  rounded-lg overflow-hidden shadow-sm cursor-pointer"
                key={index}
              >
                <Image
                  src={img.image_url}
                  alt="pic"
                  fill
                  className="object-cover"
                  onClick={() => handlerPreview(img.image_url)}
                />
              </div>
            ))}
          </div>
        </div>
        <div id="prd-profile" className="w-full ">
          <p className="text-2xl lg:text-3xl font-semibold">
            {selectedProductDetails?.name}
          </p>
          <Badge className="my-2 p-1.5 bg-amber-400">
            {upperFirstCharacter(
              selectedProductDetails?.category.category ?? ""
            )}
          </Badge>
          {/* Stock */}
          {isOutOfStock ? (
            <p className="text-red-500 ">Out of Stock</p>
          ) : (
            <p className={isLowStock ? "text-red-500" : "text-green-500"}>
              Available Stock : {stock}
            </p>
          )}
          {/*  */}
          <p className="my-4 text-orange-500 font-bold text-5xl">
            {formatIDRCurrency(
              Math.trunc(Number(selectedProductDetails?.price))
            )}
          </p>
          <div id="counter-cart" className="flex  flex-col gap-y-5">
            <div id="counter" className="flex gap-x-5 items-center">
              <p>Jumlah Pembelian</p>
              <div className="w-25 grid grid-cols-3 gap-x-2  items-center h-8 ">
                <Button
                  className=" cursor-pointer select-none bg-emerald-500 hover:bg-emerald-600"
                  id="decrement"
                  onClick={() => handlerValue("dec")}
                  disabled={value <= 1 || isOutOfStock}
                >
                  -
                </Button>
                <div className="text-center border-b-2 select-none border-gray-200 h-full flex items-center justify-center ">
                  <p>{value}</p>
                </div>
                <Button
                  className="cursor-pointer select-none bg-emerald-500 hover:bg-emerald-600"
                  id="increment"
                  onClick={() => handlerValue("inc")}
                  disabled={
                    value + quantityInCart >= (stock ?? 0) || isOutOfStock
                  }
                >
                  +
                </Button>
              </div>
            </div>
            {value == stock && (
              <p className="text-red-500 ">
                You have reached our maximum stock
              </p>
            )}
            <div id="add-cart">
              <Button
                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                disabled={
                  isOutOfStock ||
                  !user ||
                  !user.is_verified ||
                  user.role !== "CUSTOMER" ||
                  quantityInCart >= (stock ?? 0)
                }
                title={
                  !user
                    ? "Please log in to add items"
                    : !user.is_verified
                      ? "Please verify your email to shop"
                      : user.role !== "CUSTOMER"
                        ? "Admin accounts cannot shop."
                        : isOutOfStock || quantityInCart >= (stock ?? 0)
                          ? "Out of stock"
                          : ""
                }
                onClick={() => {
                  if (!selectedProductDetails || !storeIdentity || !stock)
                    return;
                  const productForCart = {
                    id: selectedProductDetails.id,
                    productId: selectedProductDetails.id,
                    name: selectedProductDetails.name,
                    price: String(selectedProductDetails.price),
                    description: selectedProductDetails.description || "",
                    image:
                      selectedProductDetails.images?.[0]?.image_url ||
                      "/fallback.png",
                  };
                  addItem(
                    productForCart,
                    selectedProductDetails.stocks[0].store.id,
                    storeIdentity.name,
                    stock,
                    value
                  );
                }}
              >
                <ShoppingCart />
                Add to Cart
              </Button>
            </div>
          </div>
          <div id="share-prd" className="my-5 flex justify-between">
            <div className="flex items-center">
              <p className="text-sm">Share:</p>
              <div id="icon-social" className="flex items-center">
                <Image
                  src="/assets/sosmed/fb.png"
                  alt="fb"
                  width={1000}
                  height={1000}
                  className="size-6"
                />
                <Image
                  src="/assets/sosmed/instagram.png"
                  alt="ig"
                  width={1000}
                  height={1000}
                  className="size-6"
                />
                <Image
                  src="/assets/sosmed/wa.png"
                  alt="wa"
                  width={50}
                  height={50}
                  className="size-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="store-profile" className=" mt-10 p-5 xl:w-[75%] mx-auto ">
        <div className="border border-gray-200   p-5 flex rounded-xl shadow-md  items-center justify-between ">
          <div id="avatar-profile" className="flex gap-x-3 items-center">
            <div id="avatar">
              <Avatar className="size-10">
                <AvatarImage src={"/assets/user.png"} />
                <AvatarFallback>ID</AvatarFallback>
              </Avatar>
            </div>
            <div id="profile" className="">
              <div className="flex gap-x-2">
                <p className="w-full font-semibold">{storeIdentity?.name}</p>
                <Badge className="bg-green-200 text-green-500">Verified</Badge>
              </div>
              <p className="flex text-xs gap-x-1 items-center">
                <MapPin className="size-5" />
                {storeIdentity?.city}, {storeIdentity?.province}
                {selectedProductDetails?.distance && (
                  <span className="ml-2 text-gray-500">
                    • {selectedProductDetails.distance.toFixed(1)} km dari kamu
                  </span>
                )}
              </p>
            </div>
          </div>
          <div id="cta" className="flex gap-x-2 ">
            {/* <Button className="border border-green-500  bg-white hover:bg-transparent cursor-pointer">
              <Store className="max-lg:text-xs  text-green-500" />
              <p className="max-lg:text-xs text-green-500">Visit Store</p>
            </Button> */}
            <Button
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
              // onClick={() => handlerWhatsapp()}
            >
              <Headset />
              <p className="max-lg:text-xs">Contact Store</p>
            </Button>
          </div>
        </div>
      </section>

      <section id="description" className="px-10 lg:px-20 xl:px-30 py-10">
        <p className="text-2xl font-semibold">Product Description</p>
        <p className="my-5 text-justify">
          {selectedProductDetails?.description}
        </p>
      </section>
      <section
        id="similar-products"
        className="px-10 py-5 mt-10 bg-green-300/30"
      >
        <p className="font-semibold text-xl">Similar Category Products</p>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="mt-5"
        >
          <CarouselContent>
            {filteredCategory?.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
              >
                <Card
                  className="p-0  rounded-md overflow-hidden gap-1 hover:shadow-2xl hover:transition-all hover:transform hover:duration-300 hover:ease-in-out"
                  onClick={() => {
                    setSelectedProductDetails(product);
                    router.push(`/product-details/${product.id}`);
                  }}
                >
                  <div className="relative w-full h-40 lg:h-50 xl:h-60 2xl:h-65 ">
                    <Image
                      src={product.images.map((img) => img.image_url)[0] || ""}
                      alt="prd-filtered-image"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold">{product.name}</p>
                    <p className="mt-2 font-bold text-green-600">
                      {formatIDRCurrency(Math.trunc(product.price))}
                    </p>
                  </CardContent>
                  <Button className="text-xs h-7 w-[85%] mx-auto my-3 bg-green-600 hover:bg-green-700 ">
                    <ShoppingCart className="size-3" /> Add to Cart
                  </Button>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </section>
  );
}
