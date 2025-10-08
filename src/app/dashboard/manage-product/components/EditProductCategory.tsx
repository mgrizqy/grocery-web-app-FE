import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiCall } from "@/helper/apiCall";
import { IProductProps } from "@/types/product";
import { upperFirstCharacter } from "@/utils/format";
import { Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface IEditProductCat {
  open: boolean;
  setOpen: (value: boolean) => void;
}
interface CategoryWithProducts {
  category: string;
  products: IProductProps[];
}
export default function EditProductCategory({
  open,
  setOpen,
}: IEditProductCat) {
  const [role, setRole] = useState("");
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem("user")!);
    if (!jsonData) return;
    if (jsonData.role === "STORE_ADMIN") {
      setRole(jsonData.role);
    }
  }, []);
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [editCat, setEditCat] = useState<CategoryWithProducts | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const arrCategories = categories.map((cat) => cat.category);
  const getCategory = async () => {
    try {
      const res = await apiCall.get("/api/product/by-categories");
      const result = res.data.data;
      setCategories(result);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (cat: string) => {
    try {
      const cleanData = cat.trim().toLowerCase();
      if (cleanData === "others")
        return alert("Kategori Others tidak dapat dihapus");
      const confirmDelete = window.confirm(
        `Anda yakin menghapus kategori ${cat}?,\nSemua produk akan berubah menjadi 'Others'`
      );
      if (!confirmDelete) return;
      await apiCall.patch(`api/product/category`, { cleanData });
      alert(`Kategori ${cat} berhasil terhapus`);
      getCategory();
    } catch (error) {
      console.log(error);
    }
  };
  const editCategory = async () => {
    const newCat = categoryName.trim().toLowerCase();
    const oldCat = editCat?.category.trim().toLowerCase();
    console.log(newCat, oldCat);
    if (!newCat) return alert("Harus ada isinya");
    try {
      const checkCat = arrCategories.some((cat) => cat === newCat);
      console.log(checkCat);
      if (checkCat) return alert("Kategori sudah ada");
      const res = await apiCall.patch("/api/product/update-category", {
        data: { newCat, oldCat },
      });
      alert("Update Success");
      getCategory();
      setCategoryName("");
      setEditCat(null);
    } catch (error) {
      console.log(error);
    }
  };

  const newCategory = async () => {
    const newCat = categoryName.trim().toLowerCase();
    const checkCategory = arrCategories.some((cat) => cat === newCat);
    if (!newCat) return alert("Kategori harus diisi");
    if (checkCategory) return alert("Kategori sudah ada");
    const res = await apiCall.post("/api/product/new-category", {
      newCat,
    });
    alert("New Category Created!");
    setCategoryName("");
    getCategory();
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className=" max-md:mt-5">
          <DialogTitle>Add/Edit Existing Category</DialogTitle>
        </DialogHeader>
        <section>
          <section id="new-category">
            <label>Category Name</label>
            <div className="flex gap-x-3 max-md:flex-col">
              <Input
                placeholder="Input new category "
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={role ? true : false}
                className="max-md:w-full"
              />
              {!editCat ? (
                <Button
                  className="bg-blue-500 hover:bg-blue-600 max-md:w-full max-md:my-3"
                  onClick={newCategory}
                  disabled={role ? true : false}
                >
                  Create
                </Button>
              ) : (
                <div className="flex gap-x-2 mt-2">
                  <Button onClick={() => editCategory()}>Save</Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      setCategoryName("");
                      setEditCat(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </section>
          <section id="edit-category" className="mt-5">
            <label>Active Product Category List</label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Category Name</TableHead>
                  <TableHead className="text-center max-md:hidden">
                    Total Product
                  </TableHead>
                  <TableHead className="text-center">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">
                      {upperFirstCharacter(cat.category)}
                    </TableCell>
                    <TableCell className="text-center max-md:hidden">
                      {cat.products.length}
                    </TableCell>
                    <TableCell className="flex items-center gap-x-2 justify-center">
                      <Button
                        disabled={role ? true : false}
                        onClick={() => {
                          setCategoryName(cat.category);
                          setEditCat(cat);
                        }}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => deleteCategory(cat.category)}
                        disabled={role ? true : false}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
}
