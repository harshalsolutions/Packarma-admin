import { FC, useState } from "react";
import { Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { IoLogOutOutline } from "react-icons/io5";
import CustomPopup from "./CustomPopup";

const ExampleNavbar: FC = function () {
  const userContext = useUser();
  const navigate = useNavigate();
  const user = userContext?.user;
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    userContext?.setUser({
      name: "",
      email: "",
      id: "",
      access: [],
    });
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img alt="" src={"./logo.png"} className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Packarma
              </span>
            </Navbar.Brand>
          </div>
          <div className="flex justify-center items-center">
            <p className="font-semibold mr-4">Hello, {user?.name}</p>
            <button
              className="hover:bg-gray-200 p-2 rounded-md"
              onClick={() => setShowPopup(true)}
            >
              <IoLogOutOutline size={22} />
            </button>
          </div>
        </div>
      </div>
      {showPopup && (
        <CustomPopup
          title="Confirm Logout"
          description="Are you sure you want to logout?"
          onConfirm={() => {
            handleLogout();
            setShowPopup(false);
          }}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </Navbar>
  );
};

export default ExampleNavbar;
