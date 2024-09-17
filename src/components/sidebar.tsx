import { Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiChartPie, HiUsers } from "react-icons/hi";
import { VscDebugBreakpointDataUnverified } from "react-icons/vsc";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IconType } from "react-icons";
import { RiFileExcel2Line, RiSettings4Line } from "react-icons/ri";
import { FiHeadphones } from "react-icons/fi";
import { useUser } from "../context/userContext";
import { MdDeveloperMode } from "react-icons/md";

interface MenuItem {
  name: string;
  path: string;
  icon: IconType;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/", icon: HiChartPie },
  {
    name: "Master",
    path: "/master",
    icon: HiOutlineSquares2X2,
    submenu: [
      {
        name: "Subscription",
        path: "/master/subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Banner",
        path: "/master/banner",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Ads",
        path: "/master/ads",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Credit Master",
        path: "/master/credit-master",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Product Master",
    path: "/product-master",
    icon: HiOutlineSquares2X2,
    submenu: [
      {
        name: "Category",
        path: "/product-master/category",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Sub Category",
        path: "/product-master/subcategory",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Product Form",
        path: "/product-master/product-form",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packing Type",
        path: "/product-master/packing-type",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Machine",
        path: "/product-master/packaging-machine",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Treatment",
        path: "/product-master/packaging-treatment",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Storage Condition",
        path: "/product-master/storage-condition",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Measurement Unit",
        path: "/product-master/measurement-unit",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Product",
        path: "/product-master/product",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Material",
        path: "/product-master/packaging-material",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Solutions",
        path: "/product-master/packaging-solutions",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Customer Section",
    path: "/customer-section",
    icon: HiUsers,
    submenu: [
      {
        name: "User List",
        path: "/customer-section/user-list",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "User Address List",
        path: "/customer-section/user-address-list",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Refer",
        path: "/customer-section/refer",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "User Subscription",
        path: "/customer-section/user-subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Download Subscription",
        path: "/customer-section/download-subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Credit Purchase",
        path: "/customer-section/credit-purchase",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Customer Enquiry",
        path: "/customer-section/enquiry",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Staff",
    path: "/staff",
    icon: HiUsers,
  },
  {
    name: "Contact Us",
    path: "/contact-us",
    icon: FiHeadphones,
    submenu: [
      {
        name: "Customer",
        path: "/contact-us/customer",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "System Details",
        path: "/contact-us/system-details",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Report",
    path: "/report",
    icon: RiFileExcel2Line,
  },
  {
    name: "General Settings",
    path: "/general-settings",
    icon: RiSettings4Line,
  },
  {
    name: "Developer Settings",
    path: "/devloper-settings",
    icon: MdDeveloperMode,
    submenu: [
      {
        name: "Terms and Condition",
        path: "/developer-settings/terms-and-condition",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Privacy Policy",
        path: "/developer-settings/privacy-policy",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
];

const SidebarComponent: FC = function () {
  const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useUser();
  const user = userContext?.user;

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const hasPermission = (name: string) => {
    return user?.permissions?.some(
      (permission) => permission.page_name === name
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    return (
      <div key={item.path}>
        {item.submenu ? (
          <Sidebar.Collapse
            icon={item.icon}
            label={item.name}
            open={currentPage.startsWith(item.path)}
          >
            <div className="p-0">{item.submenu.map(renderMenuItem)}</div>
          </Sidebar.Collapse>
        ) : (
          <Sidebar.Item
            onClick={() => {
              if (item.path === currentPage) {
                window.location.reload();
              } else {
                navigate(item.path);
              }
            }}
            icon={({ className }: { className: string }) => (
              <item.icon
                className={`${className} ${
                  item.path === currentPage ? "text-black" : ""
                }`}
              />
            )}
            className={`${
              item.name !== "Dashboard" &&
              item.name !== "Report" &&
              item.name !== "General Settings" &&
              item.name !== "Staff"
                ? "!pl-2 !text-sm"
                : "font-medium"
            } ${
              item.path === currentPage ? "bg-lime-500 hover:bg-lime-500" : ""
            } cursor-pointer`}
          >
            <span className="whitespace-normal">{item.name}</span>
          </Sidebar.Item>
        )}
      </div>
    );
  };

  return (
    <Sidebar className="lg:w-[24%] flex-grow h-[100vh] pt-16">
      <div className="flex flex-col justify-between">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {menuItems
              .filter((item) => hasPermission(item.name))
              .map(renderMenuItem)}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
