"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/helper/apiCall";
import { IProductProps } from "@/types/product";
import { formatIDRCurrency, upperFirstCharacter } from "@/utils/format";
import { ShoppingCart, TicketPercent } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";

interface CategoryWithProducts {
  category: string;
  products: IProductProps[];
}

export default function NewProduct() {
  const router = useRouter();
  // check role, kalau store admin, lempar ke order page
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem("user")!);
    if (!jsonData) return;
    if (jsonData.role === "STORE_ADMIN") {
      toast.error("You are not allowed to access this page");
      router.replace("/dashboard/manage-product/product-list");
      return;
    }
  }, [router]);
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    newImages[index] = null;
    newPreviews[index] = null;

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);

  const [prdName, setPrdName] = useState("");
  const [prdDesc, setPrdDesc] = useState("");
  const [prdPrice, setPrdPrice] = useState("");
  const [prdCategory, setPrdCategory] = useState("");

  const getCategory = async () => {
    try {
      const res = await apiCall.get("/api/product/by-categories");
      const result = res.data.data;
      setCategories(result);
    } catch (error) {
      console.log(error);
    }
  };
  const arrCategories = categories.map((cat) => cat.category);
  const handleSubmit = async () => {
    if (!prdName || !prdPrice || !prdCategory) {
      alert("Please fill all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("name", prdName);
    formData.append("description", prdDesc);
    formData.append("price", prdPrice);
    formData.append("category", prdCategory);
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });
    try {
      const res = await apiCall.post("/api/product/new-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      alert("Create New Product Success");
      // Reset semua data bos
      setPrdName("");
      setPrdDesc("");
      setPrdPrice("");
      setPrdCategory("");
      setImages([null, null, null, null]);
      setPreviews([null, null, null, null]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <DashboardLayout>
      <section className="flex flex-row gap-x-5 p-5">
        <section id="prd-details" className="flex xl:basis-2/3 w-full gap-x-5">
          <section
            id="prd-info"
            className="bg-white w-full  rounded-md shadow-sm px-5 py-4"
          >
            <div id="prd-photo-uploader">
              <h1 className="text-xl font-semibold my-2">Product Picture</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4  gap-5">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="relative">
                    <label
                      htmlFor={`file-${index}`}
                      className="h-40 text-center border-2 border-dashed border-black flex items-center justify-center text-gray-500 text-sm cursor-pointer rounded-md p-4 hover:bg-gray-100"
                    >
                      {previews[index] ? (
                        <Image
                          src={previews[index] as string}
                          alt={`Preview ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full"
                          unoptimized
                        ></Image>
                      ) : (
                        `Upload Gambar ${index + 1}`
                      )}
                    </label>
                    <input
                      id={`file-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="hidden"
                    />
                    {previews[index] && (
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        type="button"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div id="prd-details">
              <h1 className="text-xl font-semibold my-5">
                Product Detail Information
              </h1>
              <div className="flex mb-5 items-center">
                <p className="w-full">Product Name</p>
                <Input
                  className=""
                  value={prdName}
                  onChange={(e) => setPrdName(e.target.value)}
                ></Input>
              </div>
              <div className="flex flex-col gap-3">
                <p>Product Description</p>
                <Textarea
                  value={prdDesc}
                  onChange={(e) => setPrdDesc(e.target.value)}
                />
              </div>
              <div id="submenu" className="flex gap-5 mt-10 max-lg:flex-col">
                <div className="flex items-center gap-5">
                  <p className="">Product Category</p>
                  <Select
                    value={prdCategory}
                    onValueChange={(value) => setPrdCategory(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {arrCategories.map((cat, idx) => (
                        <SelectGroup key={idx}>
                          <SelectItem value={cat}>
                            {upperFirstCharacter(cat)}
                          </SelectItem>
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex max-lg:gap-x-4 gap-x-5 items-center">
                  <p className="text-nowrap">Product Price</p>
                  <Input
                    placeholder="50000 (in IDR)"
                    type="number"
                    value={prdPrice}
                    onChange={(e) => setPrdPrice(e.target.value)}
                    className="w-fit"
                  ></Input>
                </div>
              </div>
            </div>
            <div id="btn" className="my-5">
              <Button
                className="bg-blue-500 hover:bg-blue-600 shadow-sm cursor-pointer"
                onClick={handleSubmit}
              >
                Create New Product
              </Button>
            </div>
          </section>
        </section>
        <section
          id="prd-preview"
          className="bg-white basis-1/3 w-full h-[80vh] overflow-auto rounded-md shadow-sm max-xl:hidden  "
        >
          <h1 className="text-xl font-semibold my-5 px-5 py-2">
            Live Product Preview
          </h1>
          <div id="banner-preview" className="relative w-full h-[250px] ">
            {previews[0] ? (
              <Image
                src={previews[0]}
                alt="banner-preview"
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src="/fallback.png"
                alt="banner-preview"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div
            id="price-preview"
            className="flex flex-col gap-y-1.5 p-5 relative"
          >
            <p className="text-3xl font-bold text-orange-500">
              {prdPrice ? formatIDRCurrency(Number(prdPrice)) : "Rp XXXXX"}
            </p>
            <p className="text-xl font-semibold">
              {prdName ? prdName : "My Product"}
            </p>
            <p>Available Stock: 50</p>
            <div className="flex items-center justify-between">
              <Badge className="rounded-full h-7 bg-amber-400">
                {prdCategory
                  ? upperFirstCharacter(prdCategory)
                  : "Product Category"}
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700 rounded-full p-5">
                <ShoppingCart /> Add to Cart
              </Button>
            </div>
            {/* Promo Code */}
            <div className="p-2 h-8 bg-red-500 absolute top-5 right-0  flex justify-center items-center">
              <TicketPercent className="text-white size-6" />
              <p className="mx-1 text-white font-semibold">MYPRODUCT</p>
            </div>
          </div>
          <div className="w-[95%] bg-gray-300/80 h-0.5 mx-auto rounded-full"></div>
          <div id="desc-preview" className="p-4">
            <Accordion type="single" collapsible defaultValue="prd-desc">
              <AccordionItem value="prd-desc">
                <AccordionTrigger>
                  <p className="text-xl font-semibold">Product Description</p>
                </AccordionTrigger>
                <AccordionContent className="text-justify  transition-all duration-300 ">
                  {prdDesc ? (
                    prdDesc
                  ) : (
                    <p>
                      {" "}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Distinctio eum adipisci numquam doloribus quibusdam labore
                      at voluptates excepturi voluptatibus a! Lorem ipsum dolor
                      sit amet consectetur, adipisicing elit. Ea sint commodi
                      repellendus doloribus accusamus quasi deleniti quis iste
                      dicta.Lorem ipsum dolor sit amet consectetur adipisicing
                      elit.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}
