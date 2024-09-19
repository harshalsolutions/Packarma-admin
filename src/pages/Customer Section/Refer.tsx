import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import { formatDateTime } from "../../../utils/DateFormatter";

interface ReferForm {
  id: number;
  referral_code_id: number;
  referred_user_id: number;
  account_created: number;
  subscription_completed: number;
  createdAt: string;
  updatedAt: string;
  code: string;
  referred_firstname: string;
  referred_lastname: string;
  referred_email: string;
  referrer_firstname: string;
  referrer_lastname: string;
  referrer_email: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const Refer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [referForm, setReferForm] = useState<ReferForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedRefer, setSelectedRefer] = useState<ReferForm | null>(null);

  useEffect(() => {
    fetchReferForm();
  }, [currentPage, entriesPerPage]);

  const fetchReferForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_API_KEY}/customer/referrals`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
        },
      });
      setReferForm(response.data.data.referrals || []);
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
        Manage Refer
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
          <ErrorComp error={error} onRetry={fetchReferForm} />
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Referred Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Referred Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Referrer Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {referForm.length > 0 ? (
                  referForm.map((refer) => (
                    <tr
                      key={refer.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900">{refer.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {refer.referred_firstname} {refer.referred_lastname}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {refer.referred_email}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {refer.referrer_firstname} {refer.referrer_lastname}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{refer.code}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatDateTime(new Date(refer.createdAt))}
                      </td>
                      <td className="px-6 py-4 text-gray-900 flex">
                        <button
                          onClick={() => setSelectedRefer(refer)}
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
                      No refer found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!error && (
          <p className="my-4 text-sm">
            Showing {referForm.length} out of {pagination.totalItems} Refer
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
      {selectedRefer && (
        <DetailsPopup
          title="Refer Details"
          fields={[
            { label: "ID", value: selectedRefer.id?.toString() },
            {
              label: "Referred Name",
              value:
                selectedRefer.referred_firstname +
                " " +
                selectedRefer.referred_lastname,
            },
            { label: "Referred Email", value: selectedRefer.referred_email },
            {
              label: "Referrer Name",
              value:
                selectedRefer.referrer_firstname +
                " " +
                selectedRefer.referrer_lastname,
            },
            { label: "Referrer Email", value: selectedRefer.referrer_email },
            { label: "Referral Code", value: selectedRefer.code },
            {
              label: "Account Created",
              value: selectedRefer.account_created
                ? "Completed"
                : "Not Completed",
            },
            {
              label: "Subscription Status",
              value: selectedRefer.subscription_completed
                ? "Completed"
                : "Not Completed",
            },
            {
              label: "Redemption Status",
              value: selectedRefer.subscription_completed
                ? "Completed"
                : "Not Completed",
            },
            {
              label: "Created At",
              value: formatDateTime(new Date(selectedRefer.createdAt)),
            },
            {
              label: "Updated At",
              value: formatDateTime(new Date(selectedRefer.updatedAt)),
            },
          ]}
          onClose={() => setSelectedRefer(null)}
        />
      )}
    </div>
  );
};

export default Refer;
