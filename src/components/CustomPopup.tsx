import React from "react";

interface CustomPopupProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  return (
    <section className="h-[100vh] w-full fixed top-0 left-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-md w-[34%] p-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomPopup;
