import { useState } from "react";
import { Modal, TextInput } from "flowbite-react";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const AddCreditPopup = ({
  isOpen,
  onClose,
  onAddCredits,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (userId: number, credit: number) => void;
  userId: number;
}) => {
  const [credit, setCredit] = useState(0);

  const UpdateCreditHandler = () => {
    onAddCredits(userId, credit);
    onClose();
    setCredit(0);
  };

  const handleCancel = () => {
    onClose();
  };

  const increaseCredit = () => {
    setCredit(credit + 1);
  };

  const decreaseCredit = () => {
    setCredit(credit > 0 ? credit - 1 : 0);
  };

  return (
    <Modal
      size="md"
      title="Add Credit"
      show={isOpen}
      onClose={() => {
        handleCancel();
        setCredit(0);
      }}
    >
      <section className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Add Credits</h1>
          <button
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
            onClick={handleCancel}
          >
            <AiOutlineClose className="text-xl" />
          </button>
        </div>
        <div className="flex items-center justify-center mb-4 flex-col">
          <div className="flex items-center gap-2 mb-6">
            <button
              className="bg-lime-500 text-black p-2 rounded-md hover:bg-lime-600"
              onClick={decreaseCredit}
            >
              <AiOutlineMinus className="text-xl" />
            </button>
            <TextInput
              type="number"
              value={credit}
              onChange={(e) => setCredit(parseInt(e.target.value))}
              style={{ width: "100px", textAlign: "center", margin: "0 10px" }}
            />
            <button
              className="bg-lime-500 text-black p-2 rounded-md hover:bg-lime-600"
              onClick={increaseCredit}
            >
              <AiOutlinePlus className="text-xl" />
            </button>
          </div>
          <div className="flex justify-center mb-1">
            <button
              className="bg-lime-500 text-black p-2 rounded-md hover:bg-lime-600"
              onClick={UpdateCreditHandler}
            >
              Add Credits
            </button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default AddCreditPopup;