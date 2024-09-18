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

interface CreditPurchaseForm {
  id: number;
  user_id: number;
  plan_type: string;
  number_of_credits: number;
  total: string;
  invoice_date: string;
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const CreditPurchase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [creditPurchaseForm, setCreditPurchaseForm] = useState<
    CreditPurchaseForm[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedCreditPurchase, setSelectedCreditPurchase] =
    useState<CreditPurchaseForm | null>(null);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchCreditPurchase();
  }, [currentPage, entriesPerPage]);

  const fetchCreditPurchase = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BACKEND_API_KEY}/customer/credit-purchase`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setCreditPurchaseForm(response.data.data.invoices || []);
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
          `${BACKEND_API_KEY}/product/refer/${customerIdToDelete}`
        );
        fetchCreditPurchase();
      } catch (err) {
        setError("Failed to delete refer");
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
        Manage Credit Purchase
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
          <ErrorComp error={error} onRetry={fetchCreditPurchase} />
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Credits
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Invoice Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {creditPurchaseForm.length > 0 ? (
                  creditPurchaseForm.map((creditPurchase) => (
                    <tr
                      key={creditPurchase.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {creditPurchase.firstname} {creditPurchase.lastname}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.email}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.number_of_credits}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.total}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(creditPurchase.invoice_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900 text-right">
                        <button
                          onClick={() =>
                            setSelectedCreditPurchase(creditPurchase)
                          }
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
                    <td colSpan={8} className="px-6 py-4 text-center">
                      No credit purchase found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!error && (
          <p className="my-4 text-sm">
            Showing {creditPurchaseForm.length} out of {pagination.totalItems}{" "}
            Credit Purchases
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
      {selectedCreditPurchase && (
        <DetailsPopup
          title="Credit Purchase Details"
          fields={[
            { label: "ID", value: selectedCreditPurchase.id?.toString() },
            {
              label: "User ID",
              value: selectedCreditPurchase.user_id?.toString(),
            },
            {
              label: "Number of Credits",
              value: selectedCreditPurchase.number_of_credits.toString(),
            },
            {
              label: "Total",
              value: selectedCreditPurchase.total,
            },
            {
              label: "Invoice Date",
              value: new Date(
                selectedCreditPurchase.invoice_date
              ).toLocaleString(),
            },
            {
              label: "Created At",
              value: new Date(
                selectedCreditPurchase.createdAt
              )?.toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(
                selectedCreditPurchase.updatedAt
              )?.toLocaleString(),
            },
            {
              label: "Referred Name",
              value:
                selectedCreditPurchase.firstname +
                " " +
                selectedCreditPurchase.lastname,
            },
            {
              label: "Referred Email",
              value: selectedCreditPurchase.email,
            },
          ]}
          onClose={() => setSelectedCreditPurchase(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this credit purchase?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CreditPurchase;
