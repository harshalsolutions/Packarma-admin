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

interface MeasurementUnit {
  id: number;
  name: string;
  symbol: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const MeasurementUnit: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnit[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeasurementUnit, setEditingMeasurementUnit] =
    useState<MeasurementUnit | null>(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedMeasurementUnit, setSelectedMeasurementUnit] =
    useState<MeasurementUnit | null>(null);
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] = useState<
    number | null
  >(null);

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    fetchMeasurementUnits();
  }, [currentPage, entriesPerPage]);

  const fetchMeasurementUnits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/product/measurement-units`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setMeasurementUnits(response.data.data.measurementUnits || []);
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
    setEditingMeasurementUnit(null);
    setName("");
    setSymbol("");
    setStatus("active");
    setIsFormOpen(true);
  };

  const openEditForm = (measurementUnit: MeasurementUnit) => {
    setEditingMeasurementUnit(measurementUnit);
    setName(measurementUnit.name);
    setSymbol(measurementUnit.symbol);
    setStatus(measurementUnit.status);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMeasurementUnit(null);
    setName("");
    setSymbol("");
    setStatus("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: name,
        symbol: symbol,
        status: status,
      };

      let response;
      if (editingMeasurementUnit) {
        response = await axios.put(
          `${BACKEND_API_KEY}/product/measurement-units/${editingMeasurementUnit.id}`,
          data
        );
      } else {
        response = await axios.post(
          `${BACKEND_API_KEY}/product/measurement-units`,
          data
        );
      }

      closeForm();
      fetchMeasurementUnits();
    } catch (err) {
      setError("Failed to save measurement unit");
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${BACKEND_API_KEY}/product/measurement-units/${id}`, {
        status: newStatus,
      });
      fetchMeasurementUnits();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedMeasurementUnitId !== null) {
      try {
        await axios.delete(
          `${BACKEND_API_KEY}/product/measurement-units/${selectedMeasurementUnitId}`
        );
        fetchMeasurementUnits();
      } catch (err) {
        setError("Failed to delete measurement unit");
      }
      setIsDeletePopupOpen(false);
      setSelectedMeasurementUnitId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeletePopupOpen(false);
    setSelectedMeasurementUnitId(null);
  };

  const deleteMeasurementUnit = async (id: number) => {
    setSelectedMeasurementUnitId(id);
    setIsDeletePopupOpen(true);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Measurement Units
      </h1>
      {!isFormOpen && (
        <button
          onClick={openAddForm}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
        >
          Add New Measurement Unit
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
            <ErrorComp error={error} onRetry={fetchMeasurementUnits} />
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
                      Symbol
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
                  {measurementUnits.length > 0 ? (
                    measurementUnits.map((measurementUnit) => (
                      <tr
                        key={measurementUnit.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {measurementUnit.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {measurementUnit.name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {measurementUnit.symbol}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={measurementUnit.status === "active"}
                            onChange={() =>
                              toggleStatus(
                                measurementUnit.id,
                                measurementUnit.status
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() =>
                              setSelectedMeasurementUnit(measurementUnit)
                            }
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => openEditForm(measurementUnit)}
                            className="text-2xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() =>
                              deleteMeasurementUnit(measurementUnit.id)
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
                        No measurement units found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!error && (
            <p className="my-4 text-sm">
              Showing {measurementUnits.length} out of {pagination.totalItems}{" "}
              Measurement Units
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
        <div className="w-[50%] mx-auto my-10">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
            {editingMeasurementUnit
              ? "Edit Measurement Unit"
              : "Add New Measurement Unit"}
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
                htmlFor="symbol"
                className="block text-sm font-medium text-gray-700"
              >
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
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
                {editingMeasurementUnit
                  ? "Update Measurement Unit"
                  : "Add Measurement Unit"}
              </button>
            </div>
          </form>
        </div>
      )}
      {selectedMeasurementUnit && (
        <DetailsPopup
          title="Measurement Unit Details"
          fields={[
            { label: "ID", value: selectedMeasurementUnit.id.toString() },
            { label: "Name", value: selectedMeasurementUnit.name },
            { label: "Symbol", value: selectedMeasurementUnit.symbol },
            {
              label: "Status",
              value:
                selectedMeasurementUnit.status === "active"
                  ? "Active"
                  : "Inactive",
            },
            {
              label: "Created At",
              value: new Date(
                selectedMeasurementUnit.createdAt
              ).toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(
                selectedMeasurementUnit.updatedAt
              ).toLocaleString(),
            },
          ]}
          onClose={() => setSelectedMeasurementUnit(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this measurement unit?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default MeasurementUnit;
