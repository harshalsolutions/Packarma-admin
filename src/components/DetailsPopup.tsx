import { Badge } from "flowbite-react";
import { MdClose } from "react-icons/md";
import { BACKEND_MEDIA_LINK } from "../../utils/ApiKey";

interface PopupProps {
  title: string;
  fields: { label: string; value: string | JSX.Element }[];
  onClose: () => void;
}

const DetailsPopup: React.FC<PopupProps> = ({ title, fields, onClose }) => (
  <section
    onClick={onClose}
    className={`h-[100vh] w-full fixed top-0 left-0 z-50 backdrop-blur-sm bg-black/50 flex justify-center items-center`}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-white rounded-md w-[50%] p-6 transition-transform transform scale-in`}
    >
      <div className="flex justify-between w-full items-center mb-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <button onClick={onClose}>
          <span className="inline-block">
            <MdClose size={20} />
          </span>
        </button>
      </div>
      <div className="overflow-y-auto max-h-[70vh]">
        <table className="w-full text-sm text-left border ">
          <tbody>
            {fields.map((field, index) => (
              <tr key={index} className={`border-b`}>
                <td className="font-medium p-3 border-r ">{field.label}</td>
                <td className="p-3 flex items-center">
                  {field.label === "Featured" && field.value === "Yes" ? (
                    <Badge color="success">Yes</Badge>
                  ) : field.label === "Featured" && field.value === "No" ? (
                    <Badge color="failure">No</Badge>
                  ) : field.label === "Status" && field.value === "Active" ? (
                    <Badge color="success">Active</Badge>
                  ) : field.label === "Status" && field.value === "Inactive" ? (
                    <Badge color="failure">Inactive</Badge>
                  ) : field.label === "GST Document Link" &&
                    field.value !== null ? (
                    <a
                      href={`${BACKEND_MEDIA_LINK}${field.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <button>Open Link</button>
                    </a>
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
