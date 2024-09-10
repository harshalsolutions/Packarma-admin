import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";

interface CustomerForm {
  id: number;
  name: string;
  phone_number: string;
  issue: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const Customer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [customerEnquiriesForm, setCustomerEnquiriesForm] = useState<
    CustomerForm[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerForm | null>(
    null
  );
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchCustomerEnquiriesForm();
  }, [currentPage, entriesPerPage]);

  const fetchCustomerEnquiriesForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_API_KEY}/customer/enquiries`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
        },
      });
      setCustomerEnquiriesForm(response.data.data.enquiries || []);
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
    if (customerIdToDelete !== null) {
      try {
        await api.delete(
          `${BACKEND_API_KEY}/product/customers/${customerIdToDelete}`
        );
        fetchCustomerEnquiriesForm();
      } catch (err) {
        setError("Failed to delete customer");
      }
      setDeletePopupOpen(false);
      setCustomerIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletePopupOpen(false);
    setCustomerIdToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Customer
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
          <ErrorComp error={error} onRetry={fetchCustomerEnquiriesForm} />
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
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Issue Reported
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
                {customerEnquiriesForm.length > 0 ? (
                  customerEnquiriesForm.map((customerForm) => (
                    <tr
                      key={customerForm.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {customerForm.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {customerForm.name}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.phone_number}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.issue}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(customerForm.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900 text-right">
                        <button
                          onClick={() => setSelectedEnquiry(customerForm)}
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
                      No customer enquiries found // Updated message
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!error && (
          <p className="my-4 text-sm">
            Showing {customerEnquiriesForm.length} out of{" "}
            {pagination.totalItems} Customer
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
      {selectedEnquiry && (
        <DetailsPopup
          title="Customer Enquiries Details"
          fields={[
            { label: "ID", value: selectedEnquiry.id?.toString() },
            { label: "Name", value: selectedEnquiry.name },
            { label: "Phone Number", value: selectedEnquiry.phone_number },
            { label: "Issue", value: selectedEnquiry.issue },
            {
              label: "Created At",
              value: new Date(selectedEnquiry.createdAt)?.toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(selectedEnquiry.updatedAt)?.toLocaleString(),
            },
          ]}
          onClose={() => setSelectedEnquiry(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this customer?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default Customer;
