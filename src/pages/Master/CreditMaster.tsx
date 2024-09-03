import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_API_KEY } from "../../../utils/ApiKey";
import { ErrorComp } from "../../components/ErrorComp";
import toast from "react-hot-toast";

interface CreditMaster {
  id: number;
  credit_percentage: number;
  credit_price: number;
}

const CreditMaster: React.FC = () => {
  const [creditMaster, setCreditMaster] = useState<CreditMaster>({
    id: 0,
    credit_percentage: 0,
    credit_price: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreditMaster();
  }, []);

  const fetchCreditMaster = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/master/credit-master`
      );
      setCreditMaster(response.data.data);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Updating credit...");
    try {
      const formData = {
        credit_percentage: creditMaster.credit_percentage,
        credit_price: creditMaster.credit_price,
      };
      await axios.post(`${BACKEND_API_KEY}/master/credit-master`, formData);
      fetchCreditMaster();
      toast.dismiss();
      toast.success("Credit updated successfully");
    } catch (err) {
      toast.dismiss();
      toast.dismiss();
      toast.error("Failed to save data");
      setError("Failed to save data");
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Credit Master
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <ErrorComp error={error} onRetry={fetchCreditMaster} />
      ) : (
        <form
          onSubmit={handleFormSubmit}
          className="w-[40%] mt-10 gap-5 mx-auto"
        >
          <div className="mb-4">
            <label
              htmlFor="credit_percentage"
              className="block text-sm font-medium text-gray-700"
            >
              Credit Percentage
            </label>
            <input
              type="number"
              id="credit_percentage"
              value={creditMaster.credit_percentage}
              onChange={(e) =>
                setCreditMaster({
                  ...creditMaster,
                  credit_percentage: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="credit_price"
              className="block text-sm font-medium text-gray-700"
            >
              Credit Price
            </label>
            <input
              type="number"
              id="credit_price"
              value={creditMaster.credit_price}
              onChange={(e) =>
                setCreditMaster({
                  ...creditMaster,
                  credit_price: Number(e.target.value),
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
              Update Credit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreditMaster;
