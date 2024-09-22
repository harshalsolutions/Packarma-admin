import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner, TextInput } from "flowbite-react";
import { MdOutlineRemoveRedEye, MdPictureAsPdf } from "react-icons/md";
import { BACKEND_API_KEY, BACKEND_MEDIA_LINK } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import { formatDateTime } from "../../../utils/DateFormatter";
import { TbFilter, TbFilterOff } from "react-icons/tb";

interface User {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface Address {
  address_name: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  phone_number: string;
}

interface ProductDetails {
  product_description: string;
  amount: string;
  discount: string;
  taxable_value: string;
  cgst_rate: string;
  cgst_amount: string;
  sgst_rate: string;
  sgst_amount: string;
  igst_rate: string;
  igst_amount: string;
  total_amount: string;
}

interface CreditPurchaseForm {
  id: number;
  user: User;
  address: Address;
  no_of_credits: number;
  customer_name: string;
  customer_gstno: string;
  total_price: string;
  currency: string;
  invoice_link: string;
  transaction_id: string;
  invoice_date: string;
  product_details: ProductDetails;
  createdAt: string;
  updatedAt: string;
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [titleFilter, setTitleFilter] = useState("");
  const [debouncedTitleFilter, setDebouncedTitleFilter] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTitleFilter(titleFilter);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [titleFilter]);

  useEffect(() => {
    fetchCreditPurchase();
  }, [currentPage, entriesPerPage, debouncedTitleFilter]);

  const fetchCreditPurchase = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BACKEND_API_KEY}/customer/credit-purchase`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
            search: debouncedTitleFilter,
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
        <div className="flex justify-between items-center w-full my-6">
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          <div className="flex">
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded block mr-4"
              onClick={() => {
                setFilterOpen(!filterOpen);
                setTitleFilter("");
              }}
            >
              {filterOpen ? <TbFilterOff size={22} /> : <TbFilter size={22} />}
            </button>
          </div>
        </div>
        {filterOpen && (
          <div className="flex justify-start items-start mb-6 flex-col">
            <label htmlFor="search" className="text-sm mb-1 font-medium">
              Search User Name
            </label>
            <TextInput
              className="customInput w-[25%]"
              id="search"
              type="text"
              placeholder="Search here.."
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
          </div>
        )}
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
                    Billing Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Credits
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Currency
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
                        {creditPurchase.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.user.firstname}{" "}
                        {creditPurchase.user.lastname}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.no_of_credits}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.currency}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {creditPurchase.total_price}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatDateTime(new Date(creditPurchase.invoice_date))}
                      </td>
                      <td className="px-6 py-4 text-gray-900 flex">
                        <button
                          onClick={() =>
                            window.open(
                              BACKEND_MEDIA_LINK + creditPurchase.invoice_link
                            )
                          }
                          className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                          aria-label="Info"
                        >
                          <MdPictureAsPdf />
                        </button>
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
              label: "Name",
              value:
                selectedCreditPurchase.user.firstname +
                " " +
                selectedCreditPurchase.user.lastname,
            },
            {
              label: "Email",
              value: selectedCreditPurchase.user.email,
            },
            {
              label: "User ID",
              value: selectedCreditPurchase.user.user_id?.toString(),
            },
            {
              label: "Number of Credits",
              value: selectedCreditPurchase.no_of_credits.toString(),
            },
            {
              label: "Customer Name",
              value: selectedCreditPurchase.customer_name,
            },
            {
              label: "Customer GST No",
              value: selectedCreditPurchase.customer_gstno,
            },
            {
              label: "Total Price",
              value: selectedCreditPurchase.total_price,
            },
            {
              label: "Currency",
              value: selectedCreditPurchase.currency,
            },
            {
              label: "Invoice Date",
              value: formatDateTime(
                new Date(selectedCreditPurchase.invoice_date)
              ),
            },
            {
              label: "Invoice Link",
              value: (
                <a
                  href={
                    BACKEND_MEDIA_LINK + selectedCreditPurchase.invoice_link
                  }
                  target="_blank"
                  className="underline text-blue-500"
                >
                  Open Invoice
                </a>
              ),
            },
            {
              label: "Transaction ID",
              value: selectedCreditPurchase.transaction_id,
            },
            {
              label: "Product Description",
              value: selectedCreditPurchase.product_details.product_description,
            },
            {
              label: "Amount",
              value: selectedCreditPurchase.product_details.amount,
            },
            {
              label: "Discount",
              value: selectedCreditPurchase.product_details.discount,
            },
            {
              label: "Taxable Value",
              value: selectedCreditPurchase.product_details.taxable_value,
            },
            {
              label: "CGST",
              value: `${
                Number(selectedCreditPurchase.product_details.cgst_rate) * 100
              }% (${selectedCreditPurchase.product_details.cgst_amount})`,
            },
            {
              label: "SGST",
              value: `${
                Number(selectedCreditPurchase.product_details.sgst_rate) * 100
              }% (${selectedCreditPurchase.product_details.sgst_amount})`,
            },
            {
              label: "IGST",
              value: `${
                Number(selectedCreditPurchase.product_details.igst_rate) * 100
              }% (${selectedCreditPurchase.product_details.igst_amount})`,
            },
            {
              label: "Before Discount Amount",
              value: selectedCreditPurchase.product_details.total_amount,
            },
            {
              label: "Address Name",
              value: selectedCreditPurchase.address.address_name,
            },
            {
              label: "Address",
              value: selectedCreditPurchase.address.address,
            },
            {
              label: "State",
              value: selectedCreditPurchase.address.state,
            },
            {
              label: "City",
              value: selectedCreditPurchase.address.city,
            },
            {
              label: "Pincode",
              value: selectedCreditPurchase.address.pincode,
            },
            {
              label: "Phone Number",
              value: selectedCreditPurchase.address.phone_number,
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
