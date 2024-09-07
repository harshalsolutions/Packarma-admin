import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { MdOutlineRemoveRedEye, MdOutlineLock } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import { Permission } from "../../context/userContext";
import PermissionsPopup from "../../components/PermissionDialog";
import ToggleSwitch from "../../components/ToggleSwitch";

interface StaffData {
  emailid: string;
  id: number;
  name: string;
  permissions: Permission[];
  status: string;
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
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState<number | null>(null);
  const [isPermissionsPopupOpen, setPermissionsPopupOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );

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
        await api.delete(
          `${BACKEND_API_KEY}/product/customers/${staffIdToDelete}`
        );
        fetchStaffForm();
      } catch (err) {
        setError("Failed to delete staff");
      }
      setDeletePopupOpen(false);
      setStaffIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletePopupOpen(false);
    setStaffIdToDelete(null);
  };

  const handleViewPermissions = (permissions: Permission[]) => {
    setSelectedPermissions(permissions);
    setPermissionsPopupOpen(true);
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

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Staff
      </h1>
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
                          onClick={() =>
                            handleViewPermissions(staff.permissions)
                          }
                          className="text-2xl text-blue-600 dark:text-blue-500 hover:underline"
                          aria-label="Permissions"
                        >
                          <MdOutlineLock />
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
      {selectedStaff && (
        <DetailsPopup
          title="Staff Details"
          fields={[
            { label: "ID", value: selectedStaff.id.toString() },
            { label: "Name", value: selectedStaff.name },
            { label: "Email", value: selectedStaff.emailid },
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
          onCancel={handleCancelDelete}
        />
      )}
      {isPermissionsPopupOpen && (
        <PermissionsPopup
          permissions={selectedPermissions}
          onClose={() => setPermissionsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageStaff;
