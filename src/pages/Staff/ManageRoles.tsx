import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ErrorComp } from "../../components/ErrorComp";
import toast from "react-hot-toast";

interface Role {
  id: number;
  role_name: string;
  category: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_export: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const ManageRoles: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    fetchRoles();
  }, [currentPage, entriesPerPage]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_API_KEY}/staff/roles`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
        },
      });
      setRoles(response.data.data.roles || []);
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

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Roles
      </h1>
      <div className="flex justify-between items-center w-full my-6">
        <EntriesPerPage
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <ErrorComp error={error} onRetry={fetchRoles} />
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Role Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Can Create
                </th>
                <th scope="col" className="px-6 py-3">
                  Can Read
                </th>
                <th scope="col" className="px-6 py-3">
                  Can Update
                </th>
                <th scope="col" className="px-6 py-3">
                  Can Delete
                </th>
                <th scope="col" className="px-6 py-3">
                  Can Export
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr
                    key={role.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 text-gray-900">{role.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {role.role_name}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{role.category}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {role.can_create ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {role.can_read ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {role.can_update ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {role.can_delete ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {role.can_export ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(role.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(role.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {!error && (
        <p className="my-4 text-sm">
          Showing {roles.length} out of {pagination.totalItems} Roles
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
    </div>
  );
};

export default ManageRoles;
