import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Spinner } from "flowbite-react";
import { MdOutlineRemoveRedEye, MdPictureAsPdf } from "react-icons/md";
import { BACKEND_API_KEY, BACKEND_MEDIA_LINK } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import { formatDateTime } from "../../../utils/DateFormatter";

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

interface Subscription {
  type: string;
  credit_amount: number;
  duration: number;
  benefits: string;
}

interface CustomerForm {
  id: number;
  user: User;
  address: Address;
  customer_name: string;
  customer_gstno: string;
  total_price: string;
  currency: string;
  invoice_link: string;
  transaction_id: string;
  invoice_date: string;
  product_details: ProductDetails;
  subscription: Subscription;
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
      setCustomerForm(response.data.data.invoices || []);
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
                      key={customerForm.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {customerForm.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.subscription.type}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.currency}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {customerForm.total_price}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatDateTime(new Date(customerForm.invoice_date))}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatDateTime(new Date(customerForm.invoice_date))}{" "}
                      </td>
                      <td className="px-6 py-4 text-gray-900 flex">
                        <button
                          onClick={() =>
                            window.open(
                              BACKEND_MEDIA_LINK + customerForm.invoice_link
                            )
                          }
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
            { label: "ID", value: selectedCustomer.id?.toString() },
            {
              label: "Name",
              value:
                selectedCustomer.user.firstname +
                " " +
                selectedCustomer.user.lastname,
            },
            {
              label: "Email",
              value: selectedCustomer.user.email,
            },
            {
              label: "User ID",
              value: selectedCustomer.user.user_id?.toString(),
            },
            {
              label: "Customer Name",
              value: selectedCustomer.customer_name,
            },
            {
              label: "Customer GST No",
              value: selectedCustomer.customer_gstno,
            },
            {
              label: "Total Price",
              value: selectedCustomer.total_price,
            },
            {
              label: "Currency",
              value: selectedCustomer.currency,
            },
            {
              label: "Invoice Date",
              value: formatDateTime(new Date(selectedCustomer.invoice_date)),
            },
            {
              label: "Invoice Link",
              value: (
                <a
                  href={BACKEND_MEDIA_LINK + selectedCustomer.invoice_link}
                  target="_blank"
                  className="underline text-blue-500"
                >
                  Open Invoice
                </a>
              ),
            },
            {
              label: "Transaction ID",
              value: selectedCustomer.transaction_id,
            },
            {
              label: "Product Description",
              value: selectedCustomer.product_details.product_description,
            },
            {
              label: "Amount",
              value: selectedCustomer.product_details.amount,
            },
            {
              label: "Discount",
              value: selectedCustomer.product_details.discount,
            },
            {
              label: "Taxable Value",
              value: selectedCustomer.product_details.taxable_value,
            },
            {
              label: "CGST",
              value: `${
                Number(selectedCustomer.product_details.cgst_rate) * 100
              }% (${selectedCustomer.product_details.cgst_amount})`,
            },
            {
              label: "SGST",
              value: `${
                Number(selectedCustomer.product_details.sgst_rate) * 100
              }% (${selectedCustomer.product_details.sgst_amount})`,
            },
            {
              label: "IGST",
              value: `${
                Number(selectedCustomer.product_details.igst_rate) * 100
              }% (${selectedCustomer.product_details.igst_amount})`,
            },
            {
              label: "Before Discount Amount",
              value: selectedCustomer.product_details.total_amount,
            },
            {
              label: "Subscription Type",
              value: selectedCustomer.subscription.type,
            },
            {
              label: "Subscription Duration",
              value: selectedCustomer.subscription.duration.toString(),
            },
            {
              label: "Address Name",
              value: selectedCustomer.address.address_name,
            },
            {
              label: "Address",
              value: selectedCustomer.address.address,
            },
            {
              label: "State",
              value: selectedCustomer.address.state,
            },
            {
              label: "City",
              value: selectedCustomer.address.city,
            },
            {
              label: "Pincode",
              value: selectedCustomer.address.pincode,
            },
            {
              label: "Phone Number",
              value: selectedCustomer.address.phone_number,
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
