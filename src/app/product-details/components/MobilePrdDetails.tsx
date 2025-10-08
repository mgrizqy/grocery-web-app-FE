import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { IProductProps } from "@/types/product";
import { Headset, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProduct } from "@/store/useProduct";
import { formatIDRCurrency } from "@/utils/format";

interface IMobilePrdDetails {
  allProduct: IProductProps[] | null;
  detailsData?: IProductProps | null;
  className?: string;
}

export default function MobilePrdDetails({
  detailsData,
  className,
}: IMobilePrdDetails) {
  const { selectedProductDetails, setSelectedProductDetails, productsByLoc } =
    useProduct();
  const { addItem, items: cartItems } = useCartStore();
  const { user } = useAuthStore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  // Stock handler
  const stock = selectedProductDetails?.stocks.map(
    (stock) => stock.stock_quantity
  )[0];
  const isOutOfStock = stock === 0;
  const isLowStock = stock && stock <= 5;
  const filteredCategory = productsByLoc?.filter(
    (p) => p.category.category === selectedProductDetails?.category.category
  );
  const images = selectedProductDetails?.images.map((img) => img.image_url);
  console.log(images);
  const router = useRouter();
  // store
  const storeIdentity = selectedProductDetails?.stocks.map((stock: any) => {
    return {
      name: stock.store.name,
      city: stock.store.city,
      province: stock.store.province,
    };
  })[0];

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

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className={`${className}`}>
      <section id="prd-picture-carousel">
        <Carousel
          className="w-full max-w-7xl mx-auto mt-5"
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent>
            {images?.map((img, idx) => (
              <CarouselItem key={idx} className="w-full">
                <div className="relative h-56 sm:h-72 md:h-96">
                  <Image
                    src={img}
                    alt={`product-image-${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      <section id="prd-profile" className=" gap-5 px-5 py-3">
        <div className="relative ">
          <p className="font-bold text-3xl text-orange-500">
            {formatIDRCurrency(
              Math.trunc(Number(selectedProductDetails?.price))
            )}
          </p>
          <p className="my-2 text-xl font-semibold">
            {selectedProductDetails?.name}
          </p>
          {isOutOfStock ? (
            <p className="text-red-500 ">Out of Stock</p>
          ) : (
            <p className={isLowStock ? "text-red-500" : "text-green-500"}>
              Available Stock : {stock}
            </p>
          )}
          <Badge className="my-2 p-1.5 bg-amber-400">
            {selectedProductDetails?.category.category}
          </Badge>

          <div id="counter-cart" className="flex my-5 justify-between">
            <div id="counter">
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
            <div id="cart">
              <Button
                className="w-full h-9 bg-green-600 hover:bg-green-700"
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
                <ShoppingCart /> Add to Cart
              </Button>
            </div>
          </div>
          {value === stock && (
            <p className="text-red-500 text-xs my-2 ">
              You have reached our maximum stock
            </p>
          )}

          <div id="share-prd" className="flex justify-between">
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
      <section
        id="store-cta"
        className="flex justify-between px-5 py-3 items-center my-5 bg-gray-300/30"
      >
        <div id="store-profile" className="flex gap-x-2 items-center">
          <div id="avatar">
            <Avatar className="size-10">
              <AvatarImage src={"/assets/user.png"} />
              <AvatarFallback>ID</AvatarFallback>
            </Avatar>
          </div>
          <div id="profile">
            <p className="font-semibold">{storeIdentity?.name}</p>
            <p className="text-xs">
              {storeIdentity?.city},{storeIdentity?.province}
            </p>
          </div>
        </div>
        <div id="cta">
          <Button className="h-8 bg-orange-600 hover:bg-orange-500">
            {/* <Store className="text-xs" /> */}
            <Headset className="text-xs" />
            <p className="text-xs">Contact</p>
          </Button>
        </div>
      </section>
      <section id="prd-desc" className="px-5 ">
        <Accordion type="single" collapsible defaultValue="prd-desc">
          <AccordionItem value="prd-desc">
            <AccordionTrigger className="text-lg font-semibold">
              Product Description
            </AccordionTrigger>
            <AccordionContent className="text-justify">
              {" "}
              {selectedProductDetails?.description}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <section id="similar-products" className="p-5 mt-10 bg-green-300/30">
        <p className="font-semibold text-xl">Similar Products</p>
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
              <CarouselItem key={product.id} className="basis-1/2">
                <Card
                  className="p-0  rounded-md overflow-hidden gap-1"
                  onClick={() => {
                    setSelectedProductDetails(product);
                    router.push(`/product-details/${product.id}`);
                  }}
                >
                  <div className="relative w-full h-25 ">
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
                      {formatIDRCurrency(Math.trunc(Number(product?.price)))}
                    </p>
                  </CardContent>
                  <Button className="text-xs h-7 w-[85%] mx-auto my-3 bg-green-600 ">
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
