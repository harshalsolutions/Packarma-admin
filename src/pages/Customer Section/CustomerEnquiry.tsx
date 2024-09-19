import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner, TextInput } from "flowbite-react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import { TbFilter, TbFilterOff } from "react-icons/tb";
import { AiOutlineSearch } from "react-icons/ai";
import { formatDateTime } from "../../../utils/DateFormatter";
import Select from "react-select";

interface EnquiryForm {
  id: number;
  user_id: number;
  packaging_solution_id: number;
  search_time: string;
  name: string;
  image: string;
  structure_type: string;
  sequence: number;
  storage_condition_id: number;
  display_shelf_life_days: number;
  product_id: number;
  product_category_id: number;
  product_form_id: number;
  packaging_treatment_id: number;
  packing_type_id: number;
  packing_type_name: string;
  packaging_machine_id: number;
  packaging_material_id: number;
  product_min_weight: string;
  product_max_weight: string;
  min_order_quantity: number;
  min_order_quantity_unit_id: number;
  status: string;
  firstname: string;
  lastname: string;
  product_name: string;
  category_name: string;
  subcategory_name: string;
  product_form_name: string;
  packaging_treatment_name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const CustomerEnquiry: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [enquiryForm, setEnquiryForm] = useState<EnquiryForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedEnquiry, setselectedEnquiry] = useState<EnquiryForm | null>(
    null
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const [filterParams, setFilterParams] = useState({
    userId: undefined,
    userName: undefined,
    status: undefined,
    productName: undefined,
    category: undefined,
    subCategory: undefined,
    fromDate: undefined,
    toDate: undefined,
  });

  useEffect(() => {
    fetchAllData();
  }, [filterOpen]);

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchEnquiryData();
  }, [currentPage, entriesPerPage]);

  const fetchAllData = async () => {
    try {
      const [categoriesResponse, subCategoriesResponse, productsResponse] =
        await Promise.all([
          api.get(`${BACKEND_API_KEY}/product/categories`),
          api.get(`${BACKEND_API_KEY}/product/subcategories`),
          api.get(`${BACKEND_API_KEY}/product/get-products`),
        ]);
      setCategories(categoriesResponse.data.data.categories);
      setSubCategories(subCategoriesResponse.data.data.subcategories);
      setProducts(productsResponse.data.data.products);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    if (currentPage > pagination.totalPages) {
      setCurrentPage(1);
    }
  }, [pagination.totalPages]);

  const fetchEnquiryData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_API_KEY}/customer/enquiries`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
          ...filterParams,
        },
      });

      const data = response.data.data;

      setEnquiryForm(data.enquiries || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }

      setLoading(false);
      setError(null);
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilterParams({
      ...filterParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterParams({
      ...filterParams,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Customer Enquiry
      </h1>
      <div className="flex justify-between items-center w-full my-6">
        <EntriesPerPage
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
        />
        <div className="flex">
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded block mr-4"
            onClick={() => {
              setFilterOpen(!filterOpen);
              fetchEnquiryData();
            }}
          >
            {filterOpen ? <TbFilterOff size={22} /> : <TbFilter size={22} />}
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-4">
            <TextInput
              type="text"
              name="userId"
              value={filterParams.userId}
              onChange={handleFilterChange}
              placeholder="User ID"
            />
            <TextInput
              type="text"
              name="userName"
              value={filterParams.userName}
              onChange={handleFilterChange}
              placeholder="User Name"
            />
            <Select
              name="category"
              id="category"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              value={categories.find(
                (category) => category.id === filterParams.category
              )}
              onChange={(selectedOption) =>
                setFilterParams((prevState) => ({
                  ...prevState,
                  category: selectedOption?.value,
                }))
              }
              placeholder="Select Category"
              isSearchable
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />

            <Select
              name="subCategory"
              id="subcategory"
              options={subcategories.map((subcategory) => ({
                value: subcategory.id,
                label: subcategory.name,
              }))}
              value={subcategories.find(
                (subcategory) => subcategory.id === filterParams.subCategory
              )}
              onChange={(selectedOption) =>
                setFilterParams((prevState) => ({
                  ...prevState,
                  subCategory: selectedOption?.value,
                }))
              }
              isSearchable
              placeholder="Select Sub Category"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />

            <Select
              name="productName"
              id="product"
              options={products.map((product) => ({
                value: product.id,
                label: product.product_name,
              }))}
              value={products.find(
                (product) => product.id === filterParams.productName
              )}
              onChange={(selectedOption) =>
                setFilterParams((prevState) => ({
                  ...prevState,
                  productName: selectedOption?.value,
                }))
              }
              placeholder="Select Product"
              isSearchable
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="date"
              name="fromDate"
              value={filterParams.fromDate}
              onChange={handleDateFilterChange}
              placeholder="From Date"
              className="border border-gray-300 p-2"
            />
            <input
              type="date"
              name="toDate"
              value={filterParams.toDate}
              onChange={handleDateFilterChange}
              placeholder="To Date"
              className="border border-gray-300 p-2"
            />
            <div className="flex">
              <button
                className="bg-lime-500 text-black px-4 py-2 rounded"
                onClick={() => fetchEnquiryData()}
              >
                <AiOutlineSearch size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <ErrorComp error={error} onRetry={fetchEnquiryData} />
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Search Time
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {enquiryForm.length > 0 ? (
                enquiryForm.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 text-gray-900">{enquiry.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {enquiry.firstname} {enquiry.lastname}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{enquiry.name}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {formatDateTime(new Date(enquiry.search_time))}
                    </td>
                    <td className="px-6 py-4 text-gray-900 flex">
                      <button
                        onClick={() => setselectedEnquiry(enquiry)}
                        className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                        aria-label="Info"
                      >
                        <MdOutlineRemoveRedEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No Enquiry found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {!error && (
        <p className="my-4 text-sm">
          Showing {enquiryForm.length} out of {pagination.totalItems} Enquiry
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

      {selectedEnquiry && (
        <DetailsPopup
          title="Enquiry Details"
          fields={[
            { label: "ID", value: selectedEnquiry.id?.toString() },
            {
              label: "Username",
              value: selectedEnquiry.firstname + " " + selectedEnquiry.lastname,
            },
            { label: "Product Name", value: selectedEnquiry.name },
            {
              label: "Category",
              value: selectedEnquiry.category_name,
            },
            {
              label: "Sub Category",
              value: selectedEnquiry.subcategory_name,
            },
            {
              label: "Packing Type",
              value: selectedEnquiry.packing_type_name,
            },
            {
              label: "Shelf Life",
              value: String(selectedEnquiry.display_shelf_life_days),
            },
            {
              label: "Product weight",
              value:
                selectedEnquiry.product_min_weight +
                " - " +
                selectedEnquiry.product_max_weight,
            },
            {
              label: "Datetime",
              value: formatDateTime(new Date(selectedEnquiry.search_time)),
            },
          ]}
          onClose={() => setselectedEnquiry(null)}
        />
      )}
    </div>
  );
};

export default CustomerEnquiry;
