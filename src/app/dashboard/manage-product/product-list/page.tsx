"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { useProduct } from "@/store/useProduct";
import { formatIDRCurrency, upperFirstCharacter } from "@/utils/format";
import { Eye, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";
import EditProductCategory from "../components/EditProductCategory";
import EditProductDetails from "../components/EditProductDetails";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductList() {
  // check role
  const [role, setRole] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  // filter & pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("all");
  // const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number[]>([]);
  const router = useRouter();

  const { setSelectedProductDetails } = useProduct();
  const productCategories = Array.isArray(products)
    ? products.reduce((acc, product) => {
        if (
          product?.category &&
          !acc.some((item: any) => item.id === product.category.id)
        ) {
          acc.push(product.category);
        }
        return acc;
      }, [] as any[])
    : [];

  const getProductList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiCall.get("/api/product/all", {
        params: {
          page,
          limit,
          search: searchQuery || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          sort: selectedSort !== "all" ? selectedSort : undefined,
        },
      });
      console.log(res);
      setProducts(res.data.data.data);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product list");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, selectedCategory, selectedSort]);

  useEffect(() => {
    getProductList();
  }, [page, limit, searchQuery, selectedCategory, selectedSort]);
  console.log(products);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const userData = JSON.parse(userJson);
      if (userData.role === "STORE_ADMIN") {
        setRole(userData.role);
      }
    }
  }, []);

  const toggleActiveStatus = async (productId: number, newStatus: boolean) => {
    try {
      // update UI
      useProduct.setState((state) => ({
        products: state.products.map((product) =>
          product.id === productId
            ? { ...product, is_active: newStatus }
            : product
        ),
      }));

      // Update backend
      const res = await apiCall.patch(
        `/api/product/change-status/${productId}`,
        {
          is_active: { newStatus },
        }
      );
      await getProductList();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSelectedProduct = (id: number) => {
    setSelectedProduct((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deleteSelectedProduct = async () => {
    try {
      const confirm = window.confirm(
        `Apa Anda yakin ingin hapus ${selectedProduct.length} produk? Produk akan dihapus dari seluruh store`
      );
      if (!confirm) return;
      const res = await apiCall.patch("/api/product/soft-delete", {
        data: selectedProduct,
      });
      toast.success("Delete Product Success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <section className="bg-white p-5 rounded-md  shadow-sm">
        {/* Header */}
        <div
          id="header"
          className="flex max-lg:flex-col justify-between items-center"
        >
          <div>
            <h1 className="text-2xl font-semibold max-lg:my-4">Product List</h1>
          </div>
          <div
            id="searchbar"
            className="relative lg:w-[40%] w-full max-lg:my-5 lg:mr-3"
          >
            <Input
              placeholder="Search product name . . . "
              className=" "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
            <Search
              className=" absolute top-2 right-2 text-gray-400 size-5
            "
            />
          </div>
          <div className="flex max-lg:flex-col gap-x-3 items-center">
            <div className="flex gap-x-3 max-lg:mb-5 ">
              <div id="newprdbtn">
                <Button className="" hidden={role ? true : false}>
                  <Link href="/dashboard/manage-product/new-product">
                    + Add New Product
                  </Link>
                </Button>
              </div>
              <div id="edit-category">
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => setEditCategory((prev) => !prev)}
                >
                  Add/Edit Category
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-x-5">
              <div id="filter-category">
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {productCategories.map((category: any) => (
                      <SelectGroup key={category.id}>
                        <SelectItem value={category.category}>
                          {upperFirstCharacter(category.category)}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div id="filter-options">
                <Select onValueChange={(value) => setSelectedSort(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter/Sort by"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="highest-price">
                        Highest Price
                      </SelectItem>
                      <SelectItem value="lowest-price">Lowest Price</SelectItem>
                      <SelectItem value="highest-stock">
                        Highest Stock
                      </SelectItem>
                      <SelectItem value="lowest-stock">Lowest Stock</SelectItem>
                      <SelectItem value="active-product">
                        Active Product
                      </SelectItem>
                      <SelectItem value="inactive-product">
                        Inactive Product
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button
            variant={"destructive"}
            hidden={selectedProduct.length === 0}
            onClick={deleteSelectedProduct}
            className="mt-5"
          >
            Delete Selected Product
          </Button>
        </div>
        {/* Table */}
        <div id="prd-table-list">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    className="rounded-full"
                    hidden={role ? true : false}
                    checked={
                      selectedProduct.length > 0 &&
                      selectedProduct.length === products.length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProduct(products.map((p) => p.id));
                      } else {
                        setSelectedProduct([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="">Product Info</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Total Stock</TableHead>
                <TableHead className="text-center">Active/Inactive</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      className="rounded-full"
                      hidden={role ? true : false}
                      checked={selectedProduct.includes(product.id)}
                      onCheckedChange={() => toggleSelectedProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell
                    id="product-profile"
                    className="flex items-center gap-x-5"
                  >
                    <div id="picture" className="max-lg:hidden">
                      <Image
                        src={
                          product.images?.[0].image_url ??
                          "/assets/fallback.png"
                        }
                        alt="prdPic"
                        width={100}
                        height={100}
                      ></Image>
                    </div>
                    <div id="identity">
                      <p className="text-lg font-semibold">{product.name}</p>
                      <p>Product ID: {product.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {upperFirstCharacter(product.category.category)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatIDRCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stocks.reduce(
                      (acc: any, stock: any) => acc + stock.stock_quantity,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      disabled={role ? true : false}
                      checked={product.is_active}
                      onCheckedChange={(checked) =>
                        toggleActiveStatus(product.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-x-2 justify-center items-center">
                      <Button
                        hidden={role ? true : false}
                        onClick={() => {
                          setSelectedProductDetails(product); // simpan produk yang dipilih ke Zustand
                          router.push(`/dashboard/manage-product/edit-product`); // pindah ke halaman edit
                        }}
                      >
                        Edit Product
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedProductDetails(product);
                          router.push(`/product-details/${product.id}`);
                        }}
                      >
                        <Eye />
                        Preview
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {(() => {
              // Logika untuk menentukan nomor halaman mana yang akan ditampilkan
              const pageNumbers = [];
              if (totalPages <= 7) {
                // Jika halaman sedikit (<=7), tampilkan semua
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                // Jika halaman banyak, gunakan elipsis
                pageNumbers.push(1); // Halaman pertama
                if (page > 3) {
                  pageNumbers.push("...");
                }
                if (page > 2) {
                  pageNumbers.push(page - 1);
                }
                if (page > 1 && page < totalPages) {
                  pageNumbers.push(page);
                }
                if (page < totalPages - 1) {
                  pageNumbers.push(page + 1);
                }
                if (page < totalPages - 2) {
                  pageNumbers.push("...");
                }
                pageNumbers.push(totalPages); // Halaman terakhir
              }

              // Render nomor halaman dan elipsis
              return [...new Set(pageNumbers)].map((p, index) =>
                p === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p as number)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
      {/* Pagination */}

      {/* Add/Edit Category Dialog */}
      <EditProductCategory open={editCategory} setOpen={setEditCategory} />
      <EditProductDetails open={editDetails} setOpen={setEditDetails} />
    </DashboardLayout>
  );
}
