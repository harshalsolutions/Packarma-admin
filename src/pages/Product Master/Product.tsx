import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY, BACKEND_MEDIA_LINK } from "../../../utils/ApiKey";
import ToggleSwitch from "../../components/ToggleSwitch";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import toast from "react-hot-toast";

interface Product {
  id: number;
  product_name: string;
  category_id: number;
  sub_category_id: number;
  product_form_id: number;
  packaging_treatment_id: number;
  measurement_unit_id: number;
  product_image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const Product: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [productForms, setProductForms] = useState<any[]>([]);
  const [packagingTreatments, setPackagingTreatments] = useState<any[]>([]);
  const [measurementUnits, setMeasurementUnits] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedProductFormId, setSelectedProductFormId] = useState("");
  const [selectedPackagingTreatmentId, setSelectedPackagingTreatmentId] =
    useState("");
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] =
    useState("");

  useEffect(() => {
    fetchProducts();
    fetchAllData;
  }, [currentPage, entriesPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BACKEND_API_KEY}/product/get-products`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setProducts(response.data.data.products || []);
      if (response.data.data.pagination) {
        setPagination(response.data.data.pagination);
      }
      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [
        categoriesResponse,
        subCategoriesResponse,
        productFormsResponse,
        packagingTreatmentsResponse,
        measurementUnitsResponse,
      ] = await Promise.all([
        api.get(`${BACKEND_API_KEY}/product/categories`),
        api.get(`${BACKEND_API_KEY}/product/subcategories`),
        api.get(`${BACKEND_API_KEY}/product/product-form`),
        api.get(`${BACKEND_API_KEY}/product/packaging-treatment`),
        api.get(`${BACKEND_API_KEY}/product/measurement-units`),
      ]);

      setCategories(categoriesResponse.data.data.categories);
      setSubCategories(subCategoriesResponse.data.data.subcategories);
      setProductForms(productFormsResponse.data.data.productForms);
      setPackagingTreatments(
        packagingTreatmentsResponse.data.data.packaging_treatments
      );
      setMeasurementUnits(measurementUnitsResponse.data.data.measurementUnits);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch data");
    }
  };

  const deleteProduct = (id: string) => {
    setProductIdToDelete(Number(id));
    setDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productIdToDelete !== null) {
      const loadingToast = toast.loading("Deleting product...");
      try {
        await api.delete(
          `${BACKEND_API_KEY}/product/delete-product/${productIdToDelete}`
        );
        fetchProducts();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error("Failed to delete product");
      } finally {
        toast.dismiss(loadingToast);
        setDeletePopupOpen(false);
        setProductIdToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeletePopupOpen(false);
    setProductIdToDelete(null);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setName("");
    setImage(null);
    setStatus("active");
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setName(product.product_name);
    setImage(null);
    setStatus(product.status);
    setIsFormOpen(true);
    setImagePreview(product.product_image);
    setSelectedCategoryId(product.category_id.toString());
    setSelectedSubCategoryId(product.sub_category_id.toString());
    setSelectedProductFormId(product.product_form_id.toString());
    setSelectedPackagingTreatmentId(product.packaging_treatment_id.toString());
    setSelectedMeasurementUnitId(product.measurement_unit_id.toString());
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setName("");
    setImage(null);
    setStatus("");
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setSelectedProductFormId("");
    setSelectedPackagingTreatmentId("");
    setSelectedMeasurementUnitId("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving product...");
    try {
      const formData = new FormData();
      formData.append("product_name", name);
      formData.append("status", status);
      formData.append("type", "product");
      formData.append("category_id", selectedCategoryId);
      formData.append("sub_category_id", selectedSubCategoryId);
      formData.append("product_form_id", selectedProductFormId);
      formData.append("packaging_treatment_id", selectedPackagingTreatmentId);
      formData.append("measurement_unit_id", selectedMeasurementUnitId);
      if (image) {
        formData.append("product_image", image);
      }

      if (editingProduct) {
        await api.put(
          `${BACKEND_API_KEY}/product/update-product/${editingProduct.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product updated successfully");
      } else {
        await api.post(`${BACKEND_API_KEY}/product/add-product`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product added successfully");
      }

      closeForm();
      fetchProducts();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to save product");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await api.put(`${BACKEND_API_KEY}/product/update-product/${id}`, {
        status: newStatus,
      });
      fetchProducts();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Products
      </h1>
      {!isFormOpen && (
        <div className="flex justify-between items-center w-full my-6">
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          <button
            onClick={openAddForm}
            className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
          >
            Add New Product
          </button>
        </div>
      )}
      {!isFormOpen && (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="xl" />
            </div>
          ) : error ? (
            <ErrorComp error={error} onRetry={fetchProducts} />
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full overflow-x-auto text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Sub-Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product Form
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {product.product_name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {
                            categories.find(
                              (category) => category.id === product.category_id
                            )?.name
                          }
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {
                            subCategories.find(
                              (category) =>
                                category.id === product.sub_category_id
                            )?.name
                          }
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {
                            productForms.find(
                              (category) =>
                                category.id === product.product_form_id
                            )?.name
                          }
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <img
                            src={BACKEND_MEDIA_LINK + product.product_image}
                            alt={product.product_name}
                            className="w-20 h-20 object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={product.status === "active"}
                            onChange={() =>
                              toggleStatus(product.id, product.status)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => openEditForm(product)}
                            className="text-2xl text-lime-600 dark:text-lime-500 hover:underline mr-4"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id.toString())}
                            className="text-2xl text-red-600 dark:text-red-500 hover:underline"
                            aria-label="Delete"
                          >
                            <MdDeleteOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!error && (
            <p className="my-4 text-sm">
              Showing {products.length} out of {pagination.totalItems} Products
            </p>
          )}
          {pagination.totalItems >= 10 && (
            <div className="mt-4 flex justify-center items-center mb-8">
              <button
                className="px-2 py-1 rounded mr-2 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-2 py-1 rounded border mr-2 ${
                    index + 1 === pagination.currentPage
                      ? "bg-lime-500 text-white"
                      : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 rounded disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {isFormOpen && (
        <div className="mx-auto my-10 w-[80%]">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="file"
                id="image"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setImage(file as File | null);
                  } else {
                    setImage(null);
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            {editingProduct && imagePreview && (
              <div className="mb-4">
                <img
                  src={BACKEND_MEDIA_LINK + imagePreview}
                  alt="Product Preview"
                  className="w-16 h-16 object-cover mb-2"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategoryId ?? ""}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="subCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Sub-Category
              </label>
              <select
                id="subCategory"
                value={selectedSubCategoryId ?? ""}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select a sub-category
                </option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="productForm"
                className="block text-sm font-medium text-gray-700"
              >
                Product Form
              </label>
              <select
                id="productForm"
                value={selectedProductFormId ?? ""}
                onChange={(e) => setSelectedProductFormId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select a product form
                </option>
                {productForms.map((productForm) => (
                  <option key={productForm.id} value={productForm.id}>
                    {productForm.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="packagingTreatment"
                className="block text-sm font-medium text-gray-700"
              >
                Packaging Treatment
              </label>
              <select
                id="packagingTreatment"
                value={selectedPackagingTreatmentId ?? ""}
                onChange={(e) =>
                  setSelectedPackagingTreatmentId(e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select a packaging treatment
                </option>
                {packagingTreatments.map((treatment) => (
                  <option key={treatment.id} value={treatment.id}>
                    {treatment.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="measurementUnit"
                className="block text-sm font-medium text-gray-700"
              >
                Measurement Unit
              </label>
              <select
                id="measurementUnit"
                value={selectedMeasurementUnitId ?? ""}
                onChange={(e) => setSelectedMeasurementUnitId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="" disabled>
                  Select a measurement unit
                </option>
                {measurementUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-start mt-4 col-span-2">
              <button
                type="button"
                onClick={closeForm}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
      {selectedProduct && (
        <DetailsPopup
          title="Product Details"
          fields={[
            { label: "ID", value: selectedProduct.id.toString() },
            { label: "Name", value: selectedProduct.product_name },
            {
              label: "Category",
              value:
                categories.find(
                  (category) => category.id === selectedProduct.category_id
                )?.name || "N/A",
            },
            {
              label: "Sub-Category",
              value:
                subCategories.find(
                  (subCategory) =>
                    subCategory.id === selectedProduct.sub_category_id
                )?.name || "N/A",
            },
            {
              label: "Product Form",
              value:
                productForms.find(
                  (form) => form.id === selectedProduct.product_form_id
                )?.name || "N/A",
            },
            {
              label: "Packaging Treatment",
              value:
                packagingTreatments.find(
                  (treatment) =>
                    treatment.id === selectedProduct.packaging_treatment_id
                )?.name || "N/A",
            },
            {
              label: "Measurement Unit",
              value: (() => {
                const unit = measurementUnits.find(
                  (unit) => unit.id === selectedProduct.measurement_unit_id
                );
                if (unit) {
                  return `${unit.name} (${unit.symbol})`;
                }
                return "N/A";
              })(),
            },
            {
              label: "Image",
              value: (
                <img
                  src={BACKEND_MEDIA_LINK + selectedProduct.product_image}
                  alt={selectedProduct.product_name}
                  className="w-24 h-24 object-cover"
                />
              ),
            },
            {
              label: "Status",
              value:
                selectedProduct.status === "active" ? "Active" : "Inactive",
            },
            {
              label: "Created At",
              value: new Date(selectedProduct.createdAt).toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(selectedProduct.updatedAt).toLocaleString(),
            },
          ]}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this product?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Product;
