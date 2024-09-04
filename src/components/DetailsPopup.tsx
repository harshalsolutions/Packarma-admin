import { Badge } from "flowbite-react";
import React from "react";
import { MdClose } from "react-icons/md";

interface PopupProps {
  title: string;
  fields: { label: string; value: string | JSX.Element }[];
  onClose: () => void;
}

const DetailsPopup: React.FC<PopupProps> = ({ title, fields, onClose }) => (
  <section
    className={`h-[100vh] w-full fixed top-0 left-0 z-50 backdrop-blur-sm bg-black/50 flex justify-center items-center`}
  >
    <div
      className={`bg-white rounded-md w-[45%] p-6 transition-transform transform scale-in`}
    >
      <div className="flex justify-between w-full items-center mb-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <button onClick={onClose}>
          <span className="inline-block">
            <MdClose size={20} />
          </span>
        </button>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full text-sm text-left border border-gray-800">
          <tbody>
            {fields.map((field, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="font-medium p-2 border-r border-gray-800">
                  {field.label}
                </td>
                <td className="p-2 flex items-center">
                  {field.label === "Featured" && field.value === "Yes" ? (
                    <Badge color="success">Yes</Badge>
                  ) : field.label === "Featured" && field.value === "No" ? (
                    <Badge color="failure">No</Badge>
                  ) : field.label === "Status" && field.value === "Active" ? (
                    <Badge color="success">Active</Badge>
                  ) : field.label === "Status" && field.value === "Inactive" ? (
                    <Badge color="failure">Inactive</Badge>
                  ) : (
                    field.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default DetailsPopup;
