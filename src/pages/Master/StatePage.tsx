import { Spinner } from "flowbite-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import ToggleSwitch from "../../components/ToggleSwitch";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";

interface StateData {
  id: number;
  state_name: string;
  country_name: string;
  status: string;
  country_id: number;
}

interface Country {
  id: number;
  country_name: string;
  phone_code: string;
  phone_length: string;
  currency_id: number;
  status: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const StatePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingState, setEditingState] = useState<StateData | null>(null);
  const [stateName, setStateName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, [currentPage, entriesPerPage]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_API_KEY}/master/states`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
        },
      });
      setStateData(response.data.data.states || []);
      setPagination(response.data.data.pagination);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      setStateData([]);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_KEY}/master/countries`);
      setCountries(response.data.data.countries || []);
    } catch (err) {
      console.error("Failed to fetch countries", err);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.put(`${BACKEND_API_KEY}/master/state/${id}`, {
        status: newStatus,
      });
      fetchStates();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const deleteState = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      try {
        await axios.delete(`${BACKEND_API_KEY}/master/state/${id}`);
        fetchStates();
      } catch (err) {
        setError("Failed to delete state");
      }
    }
  };

  const openAddForm = () => {
    setEditingState(null);
    setStateName("");
    setCountryId("");
    setIsFormOpen(true);
  };

  const openEditForm = (state: StateData) => {
    setEditingState(state);
    setStateName(state.state_name);
    setCountryId(state.country_id.toString());
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingState(null);
    setStateName("");
    setCountryId("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = { state_name: stateName, country_id: Number(countryId) };
      if (editingState) {
        await axios.put(
          `${BACKEND_API_KEY}/master/state/${editingState.id}`,
          formData
        );
      } else {
        await axios.post(`${BACKEND_API_KEY}/master/state`, formData);
      }
      closeForm();
      fetchStates();
    } catch (err) {
      setError("Failed to save state");
    }
  };

  const currentEntries = stateData;

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage State List
      </h1>
      {!isFormOpen && (
        <button
          onClick={openAddForm}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
        >
          Add New State
        </button>
      )}
      {!isFormOpen && (
        <>
          <div className="mb-4 text-sm flex items-center justify-end">
            <h2 className="text-sm mr-2">Entries Per Page:</h2>
            <select
              className="border rounded px-2 py-1 mr-3 text-sm"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
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
                      State
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Country
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
                  {currentEntries.length > 0 ? (
                    currentEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4">{entry.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {entry.state_name}
                        </td>
                        <td className="px-6 py-4">{entry.country_name}</td>
                        <td className="px-6 py-4">
                          <ToggleSwitch
                            checked={entry.status === "active"}
                            onChange={() =>
                              toggleStatus(entry.id, entry.status)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openEditForm(entry)}
                            className="text-xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() => deleteState(entry.id)}
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
                        No states found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
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
        </>
      )}

      {isFormOpen && (
        <div className="w-[40%] mx-auto mt-10">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
            {editingState ? "Edit State" : "Add New State"}
          </h3>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label
                htmlFor="stateName"
                className="block text-sm font-medium text-gray-700"
              >
                State Name
              </label>
              <input
                type="text"
                id="stateName"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                id="country"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.country_name}
                  </option>
                ))}
              </select>
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
                {editingState ? "Edit State" : "Add State"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StatePage;
