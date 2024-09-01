import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";

interface Subscription {
  id: number;
  type: string;
  credit_amount: number;
  amount: number;
  duration: number;
  status: string;
  benefits: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const SubscriptionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [type, setType] = useState("");
  const [credit_amount, setCredit_amount] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, entriesPerPage]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/master/subscriptions`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setSubscriptions(response.data.data.subscriptions || []);
      setPagination(response.data.data.pagination);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      setSubscriptions([]);
    }
  };

  const deleteSubscription = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        await axios.delete(`${BACKEND_API_KEY}/master/subscription/${id}`);
        fetchSubscriptions();
      } catch (err) {
        setError("Failed to delete subscription");
      }
    }
  };

  const openAddForm = () => {
    setEditingSubscription(null);
    setType("");
    setCredit_amount("");
    setAmount("");
    setDuration("");
    setBenefits([]);
    setIsFormOpen(true);
  };

  const openEditForm = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setType(subscription.type);
    setCredit_amount(subscription.credit_amount.toString());
    setAmount(subscription.amount.toString());
    setDuration(subscription.duration.toString());
    setBenefits(
      subscription.benefits.split("#").filter((b) => b.trim() !== "")
    );
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
    setType("");
    setCredit_amount("");
    setAmount("");
    setDuration("");
    setBenefits([]);
  };

  const addBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        type,
        credit_amount: Number(credit_amount),
        amount: Number(amount),
        duration: Number(duration),
        benefits: benefits.join("#"),
      };
      let response;
      if (editingSubscription) {
        response = await axios.put(
          `${BACKEND_API_KEY}/master/subscription/${editingSubscription.id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${BACKEND_API_KEY}/master/subscription`,
          formData
        );
      }

      closeForm();
      fetchSubscriptions();
    } catch (err) {
      setError("Failed to save subscription");
    }
  };

  const openBenefitsPopup = (benefits: string) => {
    setBenefits(benefits.split("#"));
    setIsPopupOpen(true);
  };

  const closeBenefitsPopup = () => {
    setIsPopupOpen(false);
    setBenefits([]);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Subscriptions
      </h1>
      {!isFormOpen && (
        <button
          onClick={openAddForm}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
        >
          Add New Subscription
        </button>
      )}
      {!isFormOpen && (
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
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Credit Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Benefits
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length > 0 ? (
                    subscriptions.map((subscription) => (
                      <tr
                        key={subscription.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">
                          {subscription.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {subscription.type}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          ₹{subscription.amount}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {subscription.credit_amount}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {subscription.duration} days
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {subscription.benefits ? (
                            <button
                              onClick={() =>
                                openBenefitsPopup(subscription.benefits)
                              }
                              className="text-xl text-blue-600 dark:text-blue-500 hover:underline"
                              aria-label="View Benefits"
                            >
                              <FaInfoCircle />
                            </button>
                          ) : (
                            "No Data!"
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() => openEditForm(subscription)}
                            className="text-xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() => deleteSubscription(subscription.id)}
                            className="text-xl text-red-600 dark:text-red-500 hover:underline"
                            aria-label="Delete"
                          >
                            <MdDeleteOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        No subscriptions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="my-4 text-sm">
            Showing {subscriptions.length} out of {pagination.totalItems}{" "}
            Subscriptions
          </p>
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

      {isFormOpen && (
        <div className="mx-auto my-10 w-[80%]">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
            {editingSubscription ? "Edit Subscription" : "Add New Subscription"}
          </h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-5">
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
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="credit_amount"
                className="block text-sm font-medium text-gray-700"
              >
                Credit Amount
              </label>
              <input
                type="number"
                id="credit_amount"
                value={credit_amount}
                onChange={(e) => setCredit_amount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (days)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                    placeholder="Enter a benefit"
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <IoMdRemove />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 flex justify-center items-center"
              >
                <IoMdAdd className="mr-1" /> Add Benefit
              </button>
            </div>
            <div className="flex justify-center items-center mt-4 col-span-2">
              <button
                type="button"
                onClick={closeForm}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {editingSubscription
                  ? "Update Subscription"
                  : "Add Subscription"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black z-40 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Benefits</h3>
            <ul className="list-disc list-inside">
              {benefits.map((benefit, index) => (
                <li key={index} className="mb-2">
                  {benefit}
                </li>
              ))}
            </ul>
            <button
              onClick={closeBenefitsPopup}
              className="mt-4 px-4 py-2 bg-lime-500 text-black rounded hover:bg-lime-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
