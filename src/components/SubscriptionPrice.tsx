import { Card } from "flowbite-react";
import { useState } from "react";
import { Price } from "../pages/Master/SubscriptionPage";

const SubscriptionPrice = () => {
  const [inputPrice, setInputPrice] = useState<Price>({
    price: 0,
    currency: "",
  });

  return (
    <Card className="mb-4 col-span-2">
      <div className="flex mb-2">
        <input
          type="text"
          value={inputPrice.currency}
          onChange={(e) =>
            setInputPrice({ ...inputPrice, currency: e.target.value })
          }
          className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
          placeholder="Enter Currency"
        />
        <input
          type="number"
          value={inputPrice.price}
          onChange={(e) =>
            setInputPrice({
              ...inputPrice,
              price: Number(e.target.value),
            })
          }
          className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
          placeholder="Enter Price"
        />
      </div>
    </Card>
  );
};

export default SubscriptionPrice;
