import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { MdOutlineRemoveRedEye, MdPictureAsPdf } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import { formatDateTime } from "../../../utils/DateFormatter";

interface CustomerForm {
  user_id: number;
  firstname: string;
  lastname: string;
  subscription_id: number;
  subscription_name: string;
  total_price: string;
  currency: string;
  indian_price: string;
  invoice_link: string;
  invoice_date: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  start_date: string;
  end_date: string;
  transaction_id: string;
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
  const [customerForm, setCustomerForm] = useState<CustomerForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerForm | null>(
    null
  );
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchCustomerForm();
  }, [currentPage, entriesPerPage]);

  const fetchCustomerForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BACKEND_API_KEY}/customer/subscriptions`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setCustomerForm(response.data.data.subscriptions || []);
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
        fetchCustomerForm();
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
        Manage User Subscriptions
      </h1>
      <>
        <div className="flex justify-between items-center w-full my-6">
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          <div className="flex justify-end items-center">
            {/* <button
              className="bg-blue-500 text-white px-3 py-2 rounded block mr-4"
              onClick={() => {
                setFilterOpen(!filterOpen);
                setFilter({
                  ...filter,
                  active_subscription: "",
                  email: "",
                  phone_number: "",
                  name: "",
                  user_type: "",
                });
                fetchCustomerForm("nofilter");
              }}
            >
              {filterOpen ? <TbFilterOff size={22} /> : <TbFilter size={22} />}
            </button> */}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <ErrorComp error={error} onRetry={fetchCustomerForm} />
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
                    Subscription
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Currency
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerForm.length > 0 ? (
                  customerForm.map((customerForm) => (
                    <tr
                      key={customerForm.user_id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.user_id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {customerForm.firstname} {customerForm.lastname}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.subscription_name}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.currency}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.total_price}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatDateTime(new Date(customerForm.start_date))}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatDateTime(new Date(customerForm.end_date))}{" "}
                      </td>
                      <td className="px-6 py-4 text-gray-900 flex">
                        <button
                          onClick={() => window.open(customerForm.invoice_link)}
                          className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                          aria-label="Info"
                        >
                          <MdPictureAsPdf />
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(customerForm)}
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
                      No user subscriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!error && (
          <p className="my-4 text-sm">
            Showing {customerForm.length} out of {pagination.totalItems}{" "}
            Customer
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
      {selectedCustomer && (
        <DetailsPopup
          title="User Subscription Details"
          fields={[
            { label: "ID", value: selectedCustomer.user_id?.toString() },
            {
              label: "Name",
              value: `${selectedCustomer.firstname} ${selectedCustomer.lastname}`,
            },
            { label: "Email", value: selectedCustomer.email },
            {
              label: "Subscription ID",
              value: selectedCustomer.subscription_id?.toString(),
            },
            {
              label: "Subscription Name",
              value: selectedCustomer.subscription_name,
            },
            {
              label: "Start Date",
              value: formatDateTime(new Date(selectedCustomer.start_date)),
            },
            {
              label: "End Date",
              value: formatDateTime(new Date(selectedCustomer.end_date)),
            },
            { label: "Total Price", value: selectedCustomer.total_price },
            { label: "Currency", value: selectedCustomer.currency },
            { label: "Indian Price", value: selectedCustomer.indian_price },
            { label: "Transaction ID", value: selectedCustomer.transaction_id },
            {
              label: "Invoice Link",
              value: (
                <a
                  href={selectedCustomer.invoice_link}
                  target="_blank"
                  className="underline text-blue-500"
                >
                  Open Invoice
                </a>
              ),
            },
            {
              label: "Invoice Date",
              value: formatDateTime(new Date(selectedCustomer.invoice_date)),
            },
            {
              label: "Created At",
              value: formatDateTime(new Date(selectedCustomer.createdAt)),
            },
            {
              label: "Updated At",
              value: formatDateTime(new Date(selectedCustomer.updatedAt)),
            },
          ]}
          onClose={() => setSelectedCustomer(null)}
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
