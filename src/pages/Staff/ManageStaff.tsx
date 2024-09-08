import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import {
  MdOutlineRemoveRedEye,
  MdOutlineLock,
  MdDeleteOutline,
} from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import ToggleSwitch from "../../components/ToggleSwitch";
import { TbEdit } from "react-icons/tb";

interface StaffData {
  emailid: string;
  id: number;
  name: string;
  status: string;
  password: string;
  phonenumber: string;
  country_code: string;
  address: string;
  permissions?: [];
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const ManageStaff: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [staffForm, setStaffForm] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState<number | null>(null);
  const [editStaff, setEditStaff] = useState<StaffData | null>(null);
  const [formData, setFormData] = useState<StaffData>({
    emailid: "",
    id: 0,
    name: "",
    status: "inactive",
    password: "",
    phonenumber: "",
    country_code: "",
    address: "",
    permissions: [],
  });

  useEffect(() => {
    fetchStaffForm();
  }, [currentPage, entriesPerPage]);

  const fetchStaffForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_API_KEY}/staff/get-all-staff`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
        },
      });
      setStaffForm(response.data.data.admins || []);

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

  const handleConfirmDelete = async () => {
    if (staffIdToDelete !== null) {
      try {
        await api.delete(`${BACKEND_API_KEY}/staff/${staffIdToDelete}`);
        fetchStaffForm();
      } catch (err) {
        setError("Failed to delete staff");
      }
      setDeletePopupOpen(false);
      setStaffIdToDelete(null);
    }
  };

  const handleToggleStatus = async (staffId: number, staffStatus: string) => {
    try {
      await api.put(`${BACKEND_API_KEY}/staff/${staffId}`, {
        status: staffStatus === "active" ? "inactive" : "active",
      });
      fetchStaffForm();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let dataToSend = { ...formData };
    delete dataToSend.permissions;
    try {
      if (editStaff) {
        await api.put(`${BACKEND_API_KEY}/staff/${editStaff.id}`, {
          ...dataToSend,
        });
      } else {
        await api.post(`${BACKEND_API_KEY}/staff/add`, {
          ...dataToSend,
        });
      }
      fetchStaffForm();
      setIsFormOpen(false);
      setEditStaff(null);
      setFormData({
        emailid: "",
        id: 0,
        name: "",
        status: "inactive",
        password: "",
        phonenumber: "",
        country_code: "",
        address: "",
        permissions: [],
      });
    } catch (err) {
      setError("Failed to save staff");
    }
  };

  const handleEditStaff = (staff: StaffData) => {
    setEditStaff(staff);
    setFormData(staff);
    setIsFormOpen(true);
  };

  const handleAddNewAdmin = () => {
    setEditStaff(null);
    setFormData({
      emailid: "",
      id: 0,
      name: "",
      status: "inactive",
      password: "",
      phonenumber: "",
      country_code: "",
      address: "",
      permissions: [],
    });
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Staff
      </h1>
      {!isFormOpen && (
        <div className="flex justify-between items-center w-full my-6">
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          <button
            onClick={handleAddNewAdmin}
            className="bg-lime-500 text-black px-4 py-2 rounded block mr-4"
          >
            Add New Staff
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
            <ErrorComp error={error} onRetry={fetchStaffForm} />
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
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
                      Email Address
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
                  {staffForm.length > 0 ? (
                    staffForm.map((staff) => (
                      <tr
                        key={staff.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">{staff.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {staff.emailid}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={staff.status === "active"}
                            onChange={() =>
                              handleToggleStatus(staff.id, staff.status)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() => setSelectedStaff(staff)}
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => handleEditStaff(staff)}
                            className="text-2xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() => setDeletePopupOpen(true)}
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
                        No staff found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!error && (
            <p className="my-4 text-sm">
              Showing {staffForm.length} out of {pagination.totalItems} Staff
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
      {selectedStaff && (
        <DetailsPopup
          title="Staff Details"
          fields={[
            { label: "ID", value: selectedStaff.id.toString() },
            { label: "Name", value: selectedStaff.name },
            { label: "Email", value: selectedStaff.emailid },
            { label: "Phone Number", value: selectedStaff.phonenumber },
            { label: "Country Code", value: selectedStaff.country_code },
            { label: "Address", value: selectedStaff.address },
            {
              label: "Status",
              value: selectedStaff.status === "active" ? "Active" : "Inactive",
            },
          ]}
          onClose={() => setSelectedStaff(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this staff?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletePopupOpen(false)}
        />
      )}
      {isFormOpen && (
        <div className="mw-[60%] flex justify-center items-center flex-col mx-auto my-10">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-8">
            {editStaff ? "Edit Staff" : "Add New Staff"}
          </h3>
          <form
            onSubmit={handleFormSubmit}
            className="w-[60%] grid grid-cols-2 gap-4"
          >
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="emailid"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="emailid"
                name="emailid"
                value={formData.emailid}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phonenumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="number"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="countryCode"
                className="block text-sm font-medium text-gray-700"
              >
                Country Code
              </label>
              <input
                type="text"
                id="countryCode"
                name="country_code"
                value={formData.country_code}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex justify-end mt-4 col-span-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                }}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {editStaff ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
