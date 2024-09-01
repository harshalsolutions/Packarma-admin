import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { BACKEND_API_KEY, BACKEND_MEDIA_LINK } from "../../../utils/ApiKey";
import ToggleSwitch from "../../components/ToggleSwitch";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  image: string;
  status: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const CategoryPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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

  useEffect(() => {
    fetchCategories();
  }, [currentPage, entriesPerPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/product/categories`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setCategories(response.data.data.categories || []);
      setPagination(response.data.data.pagination);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      setCategories([]);
    }
  };

  const deleteCategory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${BACKEND_API_KEY}/product/categories/${id}`);
        fetchCategories();
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setName("");
    setImage(null);
    setStatus("active");
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setImage(null);
    setStatus(category.status);
    setIsFormOpen(true);
    setImagePreview(category.image);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setName("");
    setImage(null);
    setStatus("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", status);
      formData.append("type", "categories");
      if (image) {
        formData.append("image", image);
      }

      let response;
      if (editingCategory) {
        response = await axios.put(
          `${BACKEND_API_KEY}/product/categories/${editingCategory.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${BACKEND_API_KEY}/product/categories`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      closeForm();
      fetchCategories();
    } catch (err) {
      setError("Failed to save category");
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${BACKEND_API_KEY}/product/categories/${id}`, {
        status: newStatus,
      });
      fetchCategories();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Categories
      </h1>
      {!isFormOpen && (
        <button
          onClick={openAddForm}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
        >
          Add New Category
        </button>
      )}
      {!isFormOpen && (
        <>
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="xl" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
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
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {category.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <img
                            src={BACKEND_MEDIA_LINK + category.image}
                            alt={category.name}
                            className="w-16 h-16 object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={category.status === "active"}
                            onChange={() =>
                              toggleStatus(category.id, category.status)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() => openEditForm(category)}
                            className="text-xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="text-xl text-red-600 dark:text-red-500 hover:underline"
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
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="my-4 text-sm">
            Showing {categories.length} out of {pagination.totalItems}{" "}
            Categories
          </p>
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
        <div className="w-[50%] mx-auto my-10">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleFormSubmit}>
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

            {editingCategory && imagePreview && (
              <div className="mb-4">
                <img
                  src={BACKEND_MEDIA_LINK + imagePreview}
                  alt="Category Preview"
                  className="w-16 h-16 object-cover mb-2"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div className="flex items-center">
                <span className="mr-2">
                  {status === "active" ? "Active" : "Inactive"}
                </span>
                <ToggleSwitch
                  checked={status === "active"}
                  onChange={() => setStatus(status ? "active" : "inactive")}
                />
              </div>
            </div>
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
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
