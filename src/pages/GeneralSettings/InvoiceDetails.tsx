import React, { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import { ErrorComp } from "../../components/ErrorComp";
import toast from "react-hot-toast";

interface InvoiceDetails {
  id: number;
  name: string;
  gst_number: string;
  address: string;
  bank_name: string;
  account_number: string;
  ifsc: string;
  beneficiary_number: string;
}

const InvoiceDetails: React.FC = () => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    id: 0,
    name: "",
    gst_number: "",
    address: "",
    bank_name: "",
    account_number: "",
    ifsc: "",
    beneficiary_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, []);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BACKEND_API_KEY}/general-settings/invoice-details`
      );
      setInvoiceDetails(response.data.data);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Updating invoice details...");
    try {
      const formData = {
        name: invoiceDetails.name,
        gst_number: invoiceDetails.gst_number,
        address: invoiceDetails.address,
        bank_name: invoiceDetails.bank_name,
        account_number: invoiceDetails.account_number,
        ifsc: invoiceDetails.ifsc,
        beneficiary_number: invoiceDetails.beneficiary_number,
      };
      await api.put(
        `${BACKEND_API_KEY}/general-settings/invoice-details`,
        formData
      );
      fetchInvoiceDetails();
      toast.dismiss();
      toast.success("Invoice details updated successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to save data");
      setError("Failed to save data");
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <ErrorComp error={error} onRetry={fetchInvoiceDetails} />
      ) : (
        <form onSubmit={handleFormSubmit} className="w-[60%] gap-5 mx-auto">
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
              value={invoiceDetails.name}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  name: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gst_number"
              className="block text-sm font-medium text-gray-700"
            >
              GST Number
            </label>
            <input
              type="text"
              id="gst_number"
              value={invoiceDetails.gst_number}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  gst_number: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={invoiceDetails.address}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  address: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="bank_name"
              className="block text-sm font-medium text-gray-700"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bank_name"
              value={invoiceDetails.bank_name}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  bank_name: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="account_number"
              className="block text-sm font-medium text-gray-700"
            >
              Account Number
            </label>
            <input
              type="text"
              id="account_number"
              value={invoiceDetails.account_number}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  account_number: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="ifsc"
              className="block text-sm font-medium text-gray-700"
            >
              IFSC
            </label>
            <input
              type="text"
              id="ifsc"
              value={invoiceDetails.ifsc}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  ifsc: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="beneficiary_number"
              className="block text-sm font-medium text-gray-700"
            >
              Beneficiary Number
            </label>
            <input
              type="text"
              id="beneficiary_number"
              value={invoiceDetails.beneficiary_number}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  beneficiary_number: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-center items-center mt-4 col-span-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              Update Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default InvoiceDetails;
