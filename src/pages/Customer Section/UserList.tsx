import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { Card, Spinner } from "flowbite-react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAddressBook,
  FaPlusCircle,
} from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { ErrorComp } from "../../components/ErrorComp";
import { AiOutlineClose } from "react-icons/ai";
import AddCreditPopup from "../../components/AddCreditPopup";

interface CustomerForm {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  email_domain: string;
  password: string;
  email_verified: boolean;
  gst_number: string;
  gst_document_link: string;
  email_verified_at: string;
  phone_number: string;
  country_code: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
  code: string;
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

  const [addressList, setAddressList] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [onAddressDetails, setOnAddressDetails] = useState({
    name: "",
    email: "",
    phone_number: "",
    credits: 0,
  });

  const [isAddCreditPopupOpen, setIsAddCreditPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomerForm();
  }, [currentPage, entriesPerPage]);

  const fetchCustomerForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_API_KEY}/customer/users`, {
        params: {
          page: currentPage,
          limit: entriesPerPage,
        },
      });
      setCustomerForm(response.data.data.users || []);
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

  const fetchAddresses = async (userId: number) => {
    try {
      const response = await api.get(
        `${BACKEND_API_KEY}/customer/users/addresses/${userId}`
      );
      setAddressList(response.data.data.addresses || []);
      setShowDetails(true);
      setOnAddressDetails({
        name:
          customerForm.find((user) => user.user_id === userId)?.firstname +
            " " +
            customerForm.find((user) => user.user_id === userId)?.lastname ||
          "",
        email:
          customerForm.find((user) => user.user_id === userId)?.email || "",
        phone_number:
          customerForm.find((user) => user.user_id === userId)?.phone_number ||
          "",
        credits:
          customerForm.find((user) => user.user_id === userId)?.credits || 0,
      });
    } catch (err) {
      setError("Failed to fetch addresses");
    }
  };

  const handleAddCredits = (userId: number) => {
    setSelectedUserId(userId);
    setIsAddCreditPopupOpen(true);
  };

  const handleAddCreditsSubmit = async (userId: number, credits: number) => {
    try {
      await api.post(`${BACKEND_API_KEY}/customer/users/add-credit/${userId}`, {
        credits,
      });
      console.log(`Added ${credits} credits for user ID: ${userId}`);
      fetchCustomerForm();
      setIsAddCreditPopupOpen(false);
    } catch (err) {
      setError("Failed to add credits");
      setIsAddCreditPopupOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      {showDetails ? (
        <>
          <div className="relative">
            <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
              Address Details
            </h1>
            <Card className="relative m-6">
              <button
                onClick={() => {
                  setShowDetails(false);
                }}
                className="absolute top-5 right-5"
              >
                <AiOutlineClose className="text-2xl" />
              </button>
              <div className="flex flex-col w-[60%]">
                <div className="pb-1">
                  <strong>Name:</strong> {onAddressDetails?.name}
                </div>
                <div className="pb-1">
                  <strong>Email:</strong> {onAddressDetails?.email}
                </div>
                <div className="pb-1">
                  <strong>Phone Number:</strong>{" "}
                  {onAddressDetails?.phone_number}
                </div>
                <div className="pb-1">
                  <strong>Credits:</strong> {onAddressDetails?.credits}
                </div>
              </div>
            </Card>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Address Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Building
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Area
                  </th>
                </tr>
              </thead>
              <tbody>
                {addressList.map((address: any, index: any) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 text-gray-900">
                      {address.address_name}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {address.building}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{address.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
            Manage Customer
          </h1>
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
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
                      Email Address
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Referal Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      GST Number
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Credits
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
                          {customerForm.email}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {customerForm.code}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {customerForm.gst_number}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {customerForm.credits}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {new Date(customerForm.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right flex justify-end">
                          <button
                            onClick={() => setSelectedCustomer(customerForm)}
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() =>
                              handleAddCredits(customerForm.user_id)
                            }
                            className="text-xl text-green-600 dark:text-green-500 hover:underline mr-4"
                            aria-label="Add Credits"
                          >
                            <FaPlusCircle />
                          </button>
                          <button
                            onClick={() => fetchAddresses(customerForm.user_id)}
                            className="text-xl text-purple-600 dark:text-purple-500 hover:underline"
                            aria-label="Show Addresses"
                          >
                            <FaAddressBook />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        No customer found
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
      )}
      {selectedCustomer && (
        <DetailsPopup
          title="Customer Details"
          fields={[
            { label: "ID", value: selectedCustomer.user_id?.toString() },
            {
              label: "Name",
              value:
                selectedCustomer.firstname + " " + selectedCustomer.lastname,
            },
            { label: "Email", value: selectedCustomer.email },
            {
              label: "Phone Number",
              value: selectedCustomer.country_code
                ? selectedCustomer.country_code +
                  " " +
                  selectedCustomer.phone_number
                : "Not provided",
            },
            {
              label: "Referal Code",
              value: selectedCustomer.code
                ? selectedCustomer.code
                : "Not provided",
            },
            {
              label: "GST Number",
              value: selectedCustomer.gst_number
                ? selectedCustomer.gst_number
                : "Not provided",
            },
            { label: "Credits", value: selectedCustomer.credits?.toString() },
            {
              label: "Email Verified",
              value: selectedCustomer.email_verified ? "Yes" : "No",
            },
            {
              label: "Email Verified At",
              value: selectedCustomer.email_verified_at
                ? new Date(selectedCustomer.email_verified_at)?.toLocaleString()
                : "Not Verified",
            },
            {
              label: "GST Document Link",
              value: selectedCustomer.gst_document_link
                ? selectedCustomer.gst_document_link
                : "Not Provided",
            },
            {
              label: "Created At",
              value: new Date(selectedCustomer.createdAt)?.toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(selectedCustomer.updatedAt).toLocaleString(),
            },
          ]}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
      <AddCreditPopup
        isOpen={isAddCreditPopupOpen}
        onClose={() => setIsAddCreditPopupOpen(false)}
        onAddCredits={handleAddCreditsSubmit}
        userId={selectedUserId!}
      />
    </div>
  );
};

export default Customer;
