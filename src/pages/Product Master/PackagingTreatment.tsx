import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { BACKEND_API_KEY, BACKEND_MEDIA_LINK } from "../../../utils/ApiKey";
import ToggleSwitch from "../../components/ToggleSwitch";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PackagingTreatment {
  id: number;
  name: string;
  image: string;
  status: string;
  featured: number;
  short_description: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const PackagingTreatmentPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [packagingTreatments, setPackagingTreatments] = useState<
    PackagingTreatment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackagingTreatment, setEditingPackagingTreatment] =
    useState<PackagingTreatment | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [featured, setfeatured] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [shortDescription, setShortDescription] = useState("");

  useEffect(() => {
    fetchPackagingTreatments();
  }, [currentPage, entriesPerPage]);

  const fetchPackagingTreatments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/product/packaging-treatment`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setPackagingTreatments(response.data.data.packaging_treatments || []);
      setPagination(response.data.data.pagination);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      setPackagingTreatments([]);
    }
  };

  const deletePackagingTreatment = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this packaging treatment?"
      )
    ) {
      try {
        await axios.delete(
          `${BACKEND_API_KEY}/product/packaging-treatment/${id}`
        );
        fetchPackagingTreatments();
      } catch (err) {
        setError("Failed to delete packaging treatment");
      }
    }
  };

  const openAddForm = () => {
    setEditingPackagingTreatment(null);
    setName("");
    setImage(null);
    setStatus("active");
    setfeatured(0);
    setIsFormOpen(true);
  };

  const openEditForm = (packagingTreatment: PackagingTreatment) => {
    setEditingPackagingTreatment(packagingTreatment);
    setName(packagingTreatment.name);
    setImage(null);
    setStatus(packagingTreatment.status);
    setfeatured(packagingTreatment.featured ? 1 : 0);
    setIsFormOpen(true);
    setImagePreview(packagingTreatment.image);
    setShortDescription(packagingTreatment.short_description);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPackagingTreatment(null);
    setName("");
    setImage(null);
    setStatus("");
    setfeatured(0);
    setShortDescription("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("short_description", shortDescription);
      formData.append("status", status);
      formData.append("featured", String(featured));
      formData.append("type", "packagingtreatment");
      if (image) {
        formData.append("image", image);
      }

      let response;
      if (editingPackagingTreatment) {
        response = await axios.put(
          `${BACKEND_API_KEY}/product/packaging-treatment/${editingPackagingTreatment.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${BACKEND_API_KEY}/product/packaging-treatment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      closeForm();
      fetchPackagingTreatments();
    } catch (err) {
      setError("Failed to save packaging treatment");
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${BACKEND_API_KEY}/product/packaging-treatment/${id}`, {
        status: newStatus,
      });
      fetchPackagingTreatments();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const togglefeatured = async (id: number, currentfeatured: number) => {
    const newfeatured = currentfeatured === 1 ? 0 : 1;
    try {
      await axios.put(`${BACKEND_API_KEY}/product/packaging-treatment/${id}`, {
        featured: newfeatured,
      });
      fetchPackagingTreatments();
    } catch (err) {
      setError("Failed to update featured");
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Packaging Treatments
      </h1>
      {!isFormOpen && (
        <button
          onClick={openAddForm}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
        >
          Add New Packaging Treatment
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
                      featured
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packagingTreatments.length > 0 ? (
                    packagingTreatments.map((packagingTreatment) => (
                      <tr
                        key={packagingTreatment.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {packagingTreatment.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {packagingTreatment.name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <img
                            src={BACKEND_MEDIA_LINK + packagingTreatment.image}
                            alt={packagingTreatment.name}
                            className="w-16 h-16 object-cover"
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={packagingTreatment.status === "active"}
                            onChange={() =>
                              toggleStatus(
                                packagingTreatment.id,
                                packagingTreatment.status
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={packagingTreatment.featured === 1}
                            onChange={() =>
                              togglefeatured(
                                packagingTreatment.id,
                                packagingTreatment.featured
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() => openEditForm(packagingTreatment)}
                            className="text-xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() =>
                              deletePackagingTreatment(packagingTreatment.id)
                            }
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
                        No packaging treatments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="my-4 text-sm">
            Showing {packagingTreatments.length} out of {pagination.totalItems}{" "}
            Packaging Treatments
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
            {editingPackagingTreatment
              ? "Edit Packaging Treatment"
              : "Add New Packaging Treatment"}
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

            {editingPackagingTreatment && imagePreview && (
              <div className="mb-4">
                <img
                  src={BACKEND_MEDIA_LINK + imagePreview}
                  alt="Packaging Treatment Preview"
                  className="w-16 h-16 object-cover mb-2"
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="featured"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Featured
              </label>
              <div className="flex items-center">
                <ToggleSwitch
                  checked={featured === 1}
                  onChange={() => setfeatured(featured === 1 ? 0 : 1)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="short_description"
                className="block text-sm font-medium text-gray-700"
              >
                Short Description
              </label>
              <textarea
                id="short_description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
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
                {editingPackagingTreatment
                  ? "Update Packaging Treatment"
                  : "Add Packaging Treatment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PackagingTreatmentPage;
