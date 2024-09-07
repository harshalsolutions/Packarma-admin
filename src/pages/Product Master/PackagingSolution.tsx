import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import ToggleSwitch from "../../components/ToggleSwitch";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";

interface PackagingSolutionsInterface {
  id: number;
  name: string;
  structure_type: string;
  sequence: number;
  storage_condition_id: number;
  display_shelf_life_days: number;
  product_id: number;
  product_category_id: number;
  product_form_id: number;
  packaging_treatment_id: number;
  packing_type_id: number;
  packaging_machine_id: number;
  packaging_material_id: number;
  product_min_weight: string;
  product_max_weight: string;
  min_order_quantity: number;
  min_order_quantity_unit_id: number;
  createdAt: string;
  updatedAt: string;
  storage_condition_name: string;
  product_name: string;
  category_name: string;
  product_form_name: string;
  packaging_treatment_name: string;
  packing_type_name: string;
  packaging_machine_name: string;
  packaging_material_name: string;
  min_order_quantity_unit_name: string;
  status: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const PackagingSolutions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [packagingSolutions, setPackagingSolutions] = useState<
    PackagingSolutionsInterface[]
  >([]);
  const [formPackagingSolutions, setFormPackagingSolutions] =
    useState<PackagingSolutionsInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedPackagingSolutions, setSelectedPackagingSolutions] =
    useState<PackagingSolutionsInterface | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [selectedPackagingSolutionsId, setSelectedPackagingSolutionsId] =
    useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [productForms, setProductForms] = useState<any[]>([]);
  const [packagingTreatments, setPackagingTreatments] = useState<any[]>([]);
  const [packingTypes, setPackingTypes] = useState<any[]>([]);
  const [packagingMachines, setPackagingMachines] = useState<any[]>([]);
  const [packagingMaterials, setPackagingMaterials] = useState<any[]>([]);
  const [storageConditions, setStorageConditions] = useState<any[]>([]);
  const [measurementUnits, setMeasurementUnits] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("engine");
  const [type, setType] = useState("edit");

  useEffect(() => {
    fetchPackagingSolutions();
    fetchSelectOptions();
  }, [currentPage, entriesPerPage]);

  const fetchPackagingSolutions = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BACKEND_API_KEY}/product/packaging-solutions`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setPackagingSolutions(response.data.data.packagingSolutions || []);
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

  const fetchSelectOptions = async () => {
    try {
      const [
        productsResponse,
        categoriesResponse,
        formsResponse,
        treatmentsResponse,
        typesResponse,
        machinesResponse,
        materialsResponse,
        storageConditionsResponse,
        unitsResponse,
      ] = await Promise.all([
        api.get(`${BACKEND_API_KEY}/product/get-products`),
        api.get(`${BACKEND_API_KEY}/product/categories`),
        api.get(`${BACKEND_API_KEY}/product/product-form`),
        api.get(`${BACKEND_API_KEY}/product/packaging-treatment`),
        api.get(`${BACKEND_API_KEY}/product/packing-types`),
        api.get(`${BACKEND_API_KEY}/product/packaging-machines`),
        api.get(`${BACKEND_API_KEY}/product/packaging-materials`),
        api.get(`${BACKEND_API_KEY}/product/storage-conditions`),
        api.get(`${BACKEND_API_KEY}/product/measurement-units`),
      ]);

      setProducts(productsResponse.data.data.products);
      setProductCategories(categoriesResponse.data.data.categories);
      setProductForms(formsResponse.data.data.productForms);
      setPackagingTreatments(treatmentsResponse.data.data.packaging_treatments);
      setPackingTypes(typesResponse.data.data.packingTypes);
      setPackagingMachines(machinesResponse.data.data.packaging_machine);
      setPackagingMaterials(materialsResponse.data.data.packagingMaterials);
      setStorageConditions(
        storageConditionsResponse.data.data.storageConditions
      );
      setMeasurementUnits(unitsResponse.data.data.measurementUnits);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to fetch select options"
      );
    }
  };

  const openAddForm = () => {
    setFormPackagingSolutions(null);
    setIsFormOpen(true);
    setType("add");
  };

  const openEditForm = (product: PackagingSolutionsInterface) => {
    const selectedProduct = products.find((p) => p.id === product.product_id);
    setFormPackagingSolutions({
      ...product,
      product_category_id:
        selectedProduct?.category_id || product.product_category_id,
      product_form_id: selectedProduct?.form_id || product.product_form_id,
      packaging_treatment_id:
        selectedProduct?.treatment_id || product.packaging_treatment_id,
    });
    setIsFormOpen(true);
    setType("edit");
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormPackagingSolutions(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProduct = products.find(
      (p) => p.id === formPackagingSolutions?.product_id
    );
    let data = {
      name: formPackagingSolutions?.name,
      structure_type: formPackagingSolutions?.structure_type,
      sequence: formPackagingSolutions?.sequence,
      storage_condition_id: formPackagingSolutions?.storage_condition_id,
      display_shelf_life_days: formPackagingSolutions?.display_shelf_life_days,
      product_id: formPackagingSolutions?.product_id,
      product_category_id:
        selectedProduct?.category_id ||
        formPackagingSolutions?.product_category_id,
      product_form_id:
        selectedProduct?.form_id || formPackagingSolutions?.product_form_id,
      packaging_treatment_id:
        selectedProduct?.treatment_id ||
        formPackagingSolutions?.packaging_treatment_id,
      packing_type_id: formPackagingSolutions?.packing_type_id,
      packaging_machine_id: formPackagingSolutions?.packaging_machine_id,
      packaging_material_id: formPackagingSolutions?.packaging_material_id,
      product_min_weight: formPackagingSolutions?.product_min_weight,
      product_max_weight: formPackagingSolutions?.product_max_weight,
      min_order_quantity: formPackagingSolutions?.min_order_quantity,
      min_order_quantity_unit_id:
        formPackagingSolutions?.min_order_quantity_unit_id,
      status: formPackagingSolutions?.status,
    };
    try {
      if (type === "edit") {
        await api.put(
          `${BACKEND_API_KEY}/product/packaging-solutions/${formPackagingSolutions?.id}`,
          data
        );
      } else {
        await api.post(`${BACKEND_API_KEY}/product/packaging-solutions`, data);
      }

      closeForm();
      fetchPackagingSolutions();
      setFormPackagingSolutions(null);
      setType("add");
      setActiveTab("engine");
    } catch (err) {
      setError("Failed to save packaging solution");
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await api.put(`${BACKEND_API_KEY}/product/packaging-solutions/${id}`, {
        status: newStatus,
      });
      fetchPackagingSolutions();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedPackagingSolutionsId !== null) {
      try {
        await api.delete(
          `${BACKEND_API_KEY}/product/packaging-solutions/${selectedPackagingSolutionsId}`
        );
        fetchPackagingSolutions();
      } catch (err) {
        setError("Failed to delete packaging solution");
      }
      setIsDeletePopupOpen(false);
      setSelectedPackagingSolutionsId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeletePopupOpen(false);
    setSelectedPackagingSolutionsId(null);
  };

  const deletePackagingSolutions = async (id: number) => {
    setSelectedPackagingSolutionsId(id);
    setIsDeletePopupOpen(true);
  };

  const handleProductChange = (productId: number) => {
    const selectedProduct = products.find((p) => p.id === productId);
    if (selectedProduct) {
      setFormPackagingSolutions((prev) => ({
        ...prev!,
        product_id: productId,
        product_category_id: selectedProduct.category_id,
        product_form_id: selectedProduct.product_form_id,
        packaging_treatment_id: selectedProduct.packaging_treatment_id,
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Packaging Solutions
      </h1>
      {!isFormOpen && (
        <div className="flex justify-between items-center w-full my-6">
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          <button
            onClick={openAddForm}
            className="bg-lime-500 text-black px-4 py-2 rounded block mr-4"
          >
            Add New Packaging Solution
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
            <ErrorComp error={error} onRetry={fetchPackagingSolutions} />
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Packaging Solution
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Structure Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Starts
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packagingSolutions.length > 0 ? (
                    packagingSolutions.map((packagingSolutions) => (
                      <tr
                        key={packagingSolutions.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {packagingSolutions.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {packagingSolutions.name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {packagingSolutions.structure_type}
                        </td>{" "}
                        <td className="px-6 py-4 text-gray-900">
                          {packagingSolutions.product_name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={packagingSolutions.status === "active"}
                            onChange={() =>
                              toggleStatus(
                                packagingSolutions.id,
                                packagingSolutions.status
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() =>
                              setSelectedPackagingSolutions(packagingSolutions)
                            }
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => openEditForm(packagingSolutions)}
                            className="text-2xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() =>
                              deletePackagingSolutions(packagingSolutions.id)
                            }
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
                      <td colSpan={6} className="px-6 py-4 text-center">
                        No packaging solutions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!error && (
            <p className="my-4 text-sm">
              Showing {packagingSolutions.length} out of {pagination.totalItems}{" "}
              Packaging Solutions
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
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6">
            {type === "edit"
              ? "Edit Packaging Solution"
              : "Add New Packaging Solution"}
          </h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("engine")}
              className={`px-4 py-1 text-sm rounded ${
                activeTab === "engine"
                  ? "bg-lime-500 text-blackk"
                  : "bg-gray-200"
              }`}
            >
              Engine Details
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`px-4 py-1 text-sm rounded ${
                activeTab === "product"
                  ? "bg-lime-500 text-blackk"
                  : "bg-gray-200"
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab("moq")}
              className={`px-4 py-1 text-sm rounded ${
                activeTab === "moq" ? "bg-lime-500 text-blackk" : "bg-gray-200"
              }`}
            >
              MOQ Details
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            {activeTab === "engine" && (
              <div className="grid grid-cols-2 gap-5">
                <div className="mb-4 col-span-2">
                  <label
                    htmlFor="packagingSolutionName"
                    className="block text-sm font-medium text-gray-700 w-[50%]"
                  >
                    Packaging Solution Name
                  </label>
                  <input
                    type="text"
                    id="packagingSolutionName"
                    value={formPackagingSolutions?.name || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="structureType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Structure Type
                  </label>
                  <input
                    type="text"
                    id="structureType"
                    value={formPackagingSolutions?.structure_type || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        structure_type: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="sequence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sequence
                  </label>
                  <input
                    type="number"
                    id="sequence"
                    value={formPackagingSolutions?.sequence}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        sequence: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="storageCondition"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Storage Condition
                  </label>
                  <select
                    id="storageCondition"
                    value={formPackagingSolutions?.storage_condition_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        storage_condition_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {storageConditions.map((condition) => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="displayShelfLife"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Display Shelf Life (Days)
                  </label>
                  <input
                    type="number"
                    id="displayShelfLife"
                    value={formPackagingSolutions?.display_shelf_life_days}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        display_shelf_life_days: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
            )}
            {activeTab === "product" && (
              <div className="grid grid-cols-2 gap-5">
                <div className="mb-4">
                  <label
                    htmlFor="product"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product
                  </label>
                  <select
                    id="product"
                    value={formPackagingSolutions?.product_id || ""}
                    onChange={(e) =>
                      handleProductChange(parseInt(e.target.value, 10))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="productCategory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Category
                  </label>
                  <select
                    id="productCategory"
                    value={formPackagingSolutions?.product_category_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        product_category_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {productCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
                    value={formPackagingSolutions?.product_form_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        product_form_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {productForms.map((form) => (
                      <option key={form.id} value={form.id}>
                        {form.name}
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
                    value={formPackagingSolutions?.packaging_treatment_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        packaging_treatment_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {packagingTreatments.map((treatment) => (
                      <option key={treatment.id} value={treatment.id}>
                        {treatment.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="packingType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Packing Type
                  </label>
                  <select
                    id="packingType"
                    value={formPackagingSolutions?.packing_type_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        packing_type_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {packingTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="packagingMachine"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Packaging Machine
                  </label>
                  <select
                    id="packagingMachine"
                    value={formPackagingSolutions?.packaging_machine_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        packaging_machine_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {packagingMachines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="packagingMaterial"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Packaging Material
                  </label>
                  <select
                    id="packagingMaterial"
                    value={formPackagingSolutions?.packaging_material_id || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        packaging_material_id: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {packagingMaterials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.material_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="productMinWeight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Minimum Weight
                  </label>
                  <input
                    type="text"
                    id="productMinWeight"
                    value={formPackagingSolutions?.product_min_weight || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        product_min_weight: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="productMaxWeight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Maximum Weight
                  </label>
                  <input
                    type="text"
                    id="productMaxWeight"
                    value={formPackagingSolutions?.product_max_weight || ""}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        product_max_weight: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
            )}
            {activeTab === "moq" && (
              <div className="grid grid-cols-2 gap-5">
                <div className="mb-4">
                  <label
                    htmlFor="minOrderQuantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Order Quantity
                  </label>
                  <input
                    type="number"
                    id="minOrderQuantity"
                    value={formPackagingSolutions?.min_order_quantity}
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        min_order_quantity: parseInt(e.target.value, 10),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="minOrderQuantityUnit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Order Quantity Unit
                  </label>
                  <select
                    id="minOrderQuantityUnit"
                    value={
                      formPackagingSolutions?.min_order_quantity_unit_id || ""
                    }
                    onChange={(e) =>
                      setFormPackagingSolutions((prev) => ({
                        ...prev!,
                        min_order_quantity_unit_id: parseInt(
                          e.target.value,
                          10
                        ),
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select</option>
                    {measurementUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
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
                {type === "edit"
                  ? "Update Packaging Solution"
                  : "Add Packaging Solution"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPackagingSolutions && (
        <DetailsPopup
          title="Packaging Solutions Details"
          fields={[
            { label: "ID", value: selectedPackagingSolutions.id.toString() },
            {
              label: "Packaging Solution Name",
              value: selectedPackagingSolutions.name,
            },
            {
              label: "Structure Type",
              value: selectedPackagingSolutions.structure_type || "",
            },
            {
              label: "Sequence",
              value: selectedPackagingSolutions.sequence.toString() || "",
            },
            {
              label: "Storage Condition",
              value: selectedPackagingSolutions.storage_condition_name || "",
            },
            {
              label: "Display Shelf Life (Days)",
              value:
                selectedPackagingSolutions.display_shelf_life_days.toString() ||
                "",
            },
            {
              label: "Product",
              value: selectedPackagingSolutions.product_name || "",
            },
            {
              label: "Product Category",
              value: selectedPackagingSolutions.category_name || "",
            },
            {
              label: "Product Form",
              value: selectedPackagingSolutions.product_form_name || "",
            },
            {
              label: "Packaging Treatment",
              value: selectedPackagingSolutions.packaging_treatment_name || "",
            },
            {
              label: "Packaging Type",
              value: selectedPackagingSolutions.packing_type_name || "",
            },
            {
              label: "Packaging Machine",
              value: selectedPackagingSolutions.packaging_machine_name || "",
            },
            {
              label: "Packaging Material",
              value: selectedPackagingSolutions.packaging_material_name || "",
            },
            {
              label: "Product Min Weight",
              value: selectedPackagingSolutions.product_min_weight || "",
            },
            {
              label: "Product Max Weight",
              value: selectedPackagingSolutions.product_max_weight || "",
            },
            {
              label: "Min Order Quantity",
              value:
                selectedPackagingSolutions.min_order_quantity.toString() || "",
            },
            {
              label: "Min Order Quantity Unit",
              value:
                selectedPackagingSolutions.min_order_quantity_unit_name || "",
            },
            {
              label: "Status",
              value:
                selectedPackagingSolutions.status === "active"
                  ? "Active"
                  : "Inactive",
            },
            {
              label: "Created At",
              value: new Date(
                selectedPackagingSolutions.createdAt
              ).toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(
                selectedPackagingSolutions.updatedAt
              ).toLocaleString(),
            },
          ]}
          onClose={() => setSelectedPackagingSolutions(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this packaging solution?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PackagingSolutions;
