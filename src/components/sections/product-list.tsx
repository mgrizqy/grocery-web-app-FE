"use client";
import { apiCall } from "@/helper/apiCall";
import { useLocationStore } from "@/store/use-location-store";
import { useProduct } from "@/store/useProduct";
import { IProductProps } from "@/types/product";
import { formatIDRCurrency } from "@/utils/format";
import { ShoppingCart, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDistanceFromLatLonInKm } from "@/utils/distance";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;

// }

export default function ProductList() {
  const { city, province, latitude, longitude } = useLocationStore();
  // const [products, setProducts] = useState<Product[]>([]); // lama
  const [products, setProducts] = useState<IProductProps[]>([]);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProductProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { setSelectedProductDetails, setProductsByLoc } = useProduct();
  const { addItem, items: cartItems } = useCartStore();
  const { user } = useAuthStore();

  const productsPerPage = 8;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url =
          province && city
            ? `/api/product?province=${encodeURIComponent(province.trim().toUpperCase())}&city=${encodeURIComponent(city.trim().toUpperCase())}${latitude && longitude ? `&lat=${latitude}&long=${longitude}` : ""}`
            : `/api/product/landing/all`;
        const res = await apiCall.get(url);

        console.log(res);
        console.log(url);

        let result = res.data.data as IProductProps[];
        console.log(result);

        // ⬇️ Sort by distance if lat/lon available
        if (latitude && longitude) {
          result = result
            .filter(
              (product) =>
                product.stocks?.[0]?.store?.latitude &&
                product.stocks?.[0]?.store?.longitude
            )
            .map((product) => {
              const store = product.stocks?.[0]?.store;
              const distance = getDistanceFromLatLonInKm(
                latitude,
                longitude,
                store.latitude,
                store.longitude
              );
              return { ...product, distance };
            })
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
        }

        setProducts(result);
        setFilteredProducts(result);
        setProductsByLoc(result);
      } catch (error) {
        console.error("Gagal fetch data", error);
      }
    }

    fetchProducts();
  }, [province, city, latitude, longitude]);

  useEffect(() => {
    if (selectedCategory === "semua") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p: IProductProps) =>
            p.category.category.toLowerCase() === selectedCategory
        )
      );
    }
    setCurrentPage(1);
  }, [selectedCategory, products]);
  // get all category
  useEffect(() => {
    const allCategory = products.map((p) =>
      p.category.category.trim().toLowerCase()
    );
    const uniqueCategory = ["semua"].concat(
      allCategory.filter((cat, idx) => allCategory.indexOf(cat) === idx)
    );
    setCategories(uniqueCategory);
  }, [products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const router = useRouter();
  //   arco-end

  return (
    <section className="max-w-7xl mx-auto px-6 py-3 flex flex-col" id="products">
      <div className="flex items-center gap-2 my-6">
        <Store size={20} />
        <h2 className="text-xl font-bold">
          Produk Toko Terdekat{" "}
          {city && province ? `(${city}, ${province})` : ""}
        </h2>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
              selectedCategory === cat
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {currentProducts.map((product) => {
          const itemInCart = cartItems.find(
            (item) => item.productId === product.id
          );
          const quantityInCart = itemInCart?.quantity || 0;
          const stock = product.stocks?.[0]?.stock_quantity ?? 0;
          const isOutOfStock = stock === 0 || quantityInCart >= stock;
          const isUserGuest = !user;

          const button = (
            <button
              disabled={
                !user ||
                !user.is_verified ||
                user.role !== "CUSTOMER" ||
                isOutOfStock
              }
              title={
                !user
                  ? "Please log in to add items"
                  : !user.is_verified
                    ? "Please verify your email to shop"
                    : user.role !== "CUSTOMER"
                      ? "Admin accounts cannot shop."
                      : isOutOfStock
                        ? "Out of stock"
                        : ""
              }
              onClick={(e) => {
                e.stopPropagation();
                if (
                  !product.stocks ||
                  product.stocks.length === 0 ||
                  !product.stocks[0].store
                )
                  return;

                const productForCart = {
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  price: String(product.price),
                  description: product.description || "",
                  image: product.images?.[0]?.image_url || "/fallback.png",
                };
                addItem(
                  productForCart,
                  product.stocks[0].store.id,
                  product.stocks[0].store.name,
                  stock,
                  1 // Add 1 item by default from product card
                );
              }}
              className="mt-5 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition disabled:bg-green-600/40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Tambah Keranjang</span>
            </button>
          );

          return (
            <div
              key={product.id}
              className="group bg-white border-2 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-center dark:bg-gray-800 dark:text-gray-200 "
              onClick={() => {
                setSelectedProductDetails(product);
                router.push(`/product-details/${product.id}`);
              }}
            >
              <div className="relative w-full h-40 md:h-48 overflow-hidden ">
                <Image
                  src={
                    product.images[0].image_url &&
                    product.images[0].image_url.trim() !== ""
                      ? product.images[0].image_url
                      : "/fallback.png"
                  }
                  alt={product.name || "Produk"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 line-clamp-1 dark:text-gray-200">
                  {product.name}
                </h3>
                <p className="text-green-600 font-bold mt-1">
                  {/* Rp {product.price.toLocaleString()} */}
                  {formatIDRCurrency(Number(product.price))}
                </p>

                {isUserGuest ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>{button}</TooltipTrigger>
                      <TooltipContent>
                        <p>Please log in to add items to your cart.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  button
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border text-gray-700 bg-white disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200"
        >
          Sebelumnya
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === i + 1
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border text-gray-700 bg-white disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200"
        >
          Berikutnya
        </button>
      </div>
    </section>
  );
}