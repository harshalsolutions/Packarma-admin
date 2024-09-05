import React, { useState, useEffect } from "react";
import axios from "axios";
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

interface PackagingMaterial {
  id: number;
  material_name: string;
  status: string;
  material_description?: string;
  createdAt: string;
  updatedAt: string;
  wvtr: number;
  otr: number;
  cof: number;
  sit: number;
  gsm: number;
  special_feature?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const PackagingMaterial: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [packagingMaterials, setPackagingMaterials] = useState<
    PackagingMaterial[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackagingMaterial, setEditingPackagingMaterial] =
    useState<PackagingMaterial | null>(null);
  const [materialName, setMaterialName] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [materialDescription, setMaterialDescription] = useState("");
  const [selectedPackagingMaterial, setSelectedPackagingMaterial] =
    useState<PackagingMaterial | null>(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedPackagingMaterialId, setSelectedPackagingMaterialId] =
    useState<number | null>(null);
  const [wvtr, setWvtr] = useState(0);
  const [otr, setOtr] = useState(0);
  const [cof, setCof] = useState(0);
  const [sit, setSit] = useState(0);
  const [gsm, setGsm] = useState(0);
  const [specialFeature, setSpecialFeature] = useState("");

  useEffect(() => {
    fetchPackagingMaterials();
  }, [currentPage, entriesPerPage]);

  const fetchPackagingMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/product/packaging-materials`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setPackagingMaterials(response.data.data.packagingMaterials || []);
      if (response.data.data.pagination) {
        setPagination(response.data.data.pagination);
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingPackagingMaterial(null);
    setMaterialName("");
    setStatus("active");
    setIsFormOpen(true);
  };

  const openEditForm = (packagingMaterial: PackagingMaterial) => {
    setEditingPackagingMaterial(packagingMaterial);
    setMaterialName(packagingMaterial.material_name);
    setStatus(packagingMaterial.status);
    setMaterialDescription(packagingMaterial.material_description || "");
    setWvtr(packagingMaterial.wvtr);
    setOtr(packagingMaterial.otr);
    setCof(packagingMaterial.cof);
    setSit(packagingMaterial.sit);
    setGsm(packagingMaterial.gsm);
    setSpecialFeature(packagingMaterial.special_feature || "");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPackagingMaterial(null);
    setMaterialName("");
    setStatus("");
    setMaterialDescription("");
    setWvtr(0);
    setOtr(0);
    setCof(0);
    setSit(0);
    setGsm(0);
    setSpecialFeature("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        material_name: materialName,
        material_description: materialDescription,
        status: status,
        wvtr: wvtr,
        otr: otr,
        cof: cof,
        sit: sit,
        gsm: gsm,
        special_feature: specialFeature,
      };

      if (editingPackagingMaterial) {
        await axios.put(
          `${BACKEND_API_KEY}/product/packaging-materials/${editingPackagingMaterial.id}`,
          data
        );
      } else {
        await axios.post(
          `${BACKEND_API_KEY}/product/packaging-materials`,
          data
        );
      }

      closeForm();
      fetchPackagingMaterials();
    } catch (err) {
      setError("Failed to save packaging material");
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${BACKEND_API_KEY}/product/packaging-materials/${id}`, {
        status: newStatus,
      });
      fetchPackagingMaterials();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedPackagingMaterialId !== null) {
      try {
        await axios.delete(
          `${BACKEND_API_KEY}/product/packaging-materials/${selectedPackagingMaterialId}`
        );
        fetchPackagingMaterials();
      } catch (err) {
        setError("Failed to delete packaging material");
      }
      setIsDeletePopupOpen(false);
      setSelectedPackagingMaterialId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeletePopupOpen(false);
    setSelectedPackagingMaterialId(null);
  };

  const deletePackagingMaterial = async (id: number) => {
    setSelectedPackagingMaterialId(id);
    setIsDeletePopupOpen(true);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Packaging Material
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
            Add New Packaging Material
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
            <ErrorComp error={error} onRetry={fetchPackagingMaterials} />
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
                      Description
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
                  {packagingMaterials.length > 0 ? (
                    packagingMaterials.map((packagingMaterial) => (
                      <tr
                        key={packagingMaterial.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {packagingMaterial.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {packagingMaterial.material_name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {packagingMaterial.material_description}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={packagingMaterial.status === "active"}
                            onChange={() =>
                              toggleStatus(
                                packagingMaterial.id,
                                packagingMaterial.status
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() =>
                              setSelectedPackagingMaterial(packagingMaterial)
                            }
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => openEditForm(packagingMaterial)}
                            className="text-2xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() =>
                              deletePackagingMaterial(packagingMaterial.id)
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
                        No packaging material found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!error && (
            <p className="my-4 text-sm">
              Showing {packagingMaterials.length} out of {pagination.totalItems}{" "}
              Packaging Material
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
            {editingPackagingMaterial
              ? "Edit Packaging Material"
              : "Add New Packaging Material"}
          </h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label
                htmlFor="material_name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="material_name"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="material_description"
                className="block text-sm font-medium text-gray-700"
              >
                Short Description
              </label>
              <textarea
                id="material_description"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="wvtr"
                className="block text-sm font-medium text-gray-700"
              >
                WVTR
              </label>
              <input
                type="number"
                id="wvtr"
                value={wvtr}
                onChange={(e) => setWvtr(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="otr"
                className="block text-sm font-medium text-gray-700"
              >
                OTR
              </label>
              <input
                type="number"
                id="otr"
                value={otr}
                onChange={(e) => setOtr(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="cof"
                className="block text-sm font-medium text-gray-700"
              >
                COF
              </label>
              <input
                type="number"
                id="cof"
                value={cof}
                onChange={(e) => setCof(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="sit"
                className="block text-sm font-medium text-gray-700"
              >
                SIT
              </label>
              <input
                type="number"
                id="sit"
                value={sit}
                onChange={(e) => setSit(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="gsm"
                className="block text-sm font-medium text-gray-700"
              >
                GSM
              </label>
              <input
                type="number"
                id="gsm"
                value={gsm}
                onChange={(e) => setGsm(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="special_feature"
                className="block text-sm font-medium text-gray-700"
              >
                Special Feature
              </label>
              <input
                type="text"
                id="special_feature"
                value={specialFeature}
                onChange={(e) => setSpecialFeature(e.target.value)}
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
                {editingPackagingMaterial
                  ? "Update Packaging Material"
                  : "Add Packaging Material"}
              </button>
            </div>
          </form>
        </div>
      )}
      {selectedPackagingMaterial && (
        <DetailsPopup
          title="Packaging Material Details"
          fields={[
            { label: "ID", value: selectedPackagingMaterial.id.toString() },
            { label: "Name", value: selectedPackagingMaterial.material_name },
            {
              label: "Short Description",
              value: selectedPackagingMaterial.material_description || "",
            },
            { label: "WVTR", value: selectedPackagingMaterial.wvtr.toString() },
            { label: "OTR", value: selectedPackagingMaterial.otr.toString() },
            { label: "COF", value: selectedPackagingMaterial.cof.toString() },
            { label: "SIT", value: selectedPackagingMaterial.sit.toString() },
            { label: "GSM", value: selectedPackagingMaterial.gsm.toString() },
            {
              label: "Special Feature",
              value: selectedPackagingMaterial.special_feature || "",
            },
            {
              label: "Status",
              value:
                selectedPackagingMaterial.status === "active"
                  ? "Active"
                  : "Inactive",
            },
            {
              label: "Created At",
              value: new Date(
                selectedPackagingMaterial.createdAt
              ).toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(
                selectedPackagingMaterial.updatedAt
              ).toLocaleString(),
            },
          ]}
          onClose={() => setSelectedPackagingMaterial(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this packaging material?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PackagingMaterial;
