import { Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiChartPie, HiUsers } from "react-icons/hi";
import { VscDebugBreakpointDataUnverified } from "react-icons/vsc";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IconType } from "react-icons";
import { RiSettings4Line } from "react-icons/ri";
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
  { name: "Dashboard", path: "/admin", icon: HiChartPie },
  {
    name: "Master",
    path: "/admin/master",
    icon: HiOutlineSquares2X2,
    submenu: [
      {
        name: "Subscription",
        path: "/admin/master/subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Banner",
        path: "/admin/master/banner",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Ads",
        path: "/admin/master/ads",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Credit Master",
        path: "/admin/master/credit-master",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Product Master",
    path: "/admin/product-master",
    icon: HiOutlineSquares2X2,
    submenu: [
      {
        name: "Category",
        path: "/admin/product-master/category",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Sub Category",
        path: "/admin/product-master/subcategory",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Product Form",
        path: "/admin/product-master/product-form",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packing Type",
        path: "/admin/product-master/packing-type",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Machine",
        path: "/admin/product-master/packaging-machine",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Treatment",
        path: "/admin/product-master/packaging-treatment",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Storage Condition",
        path: "/admin/product-master/storage-condition",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Measurement Unit",
        path: "/admin/product-master/measurement-unit",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Product",
        path: "/admin/product-master/product",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Material",
        path: "/admin/product-master/packaging-material",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Packaging Solutions",
        path: "/admin/product-master/packaging-solutions",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Customer Section",
    path: "/admin/customer-section",
    icon: HiUsers,
    submenu: [
      {
        name: "User List",
        path: "/admin/customer-section/user-list",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "User Address List",
        path: "/admin/customer-section/user-address-list",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Refer",
        path: "/admin/customer-section/refer",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Redeem Refer",
        path: "/admin/customer-section/redeem-refer",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "User Subscription",
        path: "/admin/customer-section/user-subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Credit Purchase",
        path: "/admin/customer-section/credit-purchase",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Customer Enquiry",
        path: "/admin/customer-section/enquiry",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Staff",
    path: "/admin/staff",
    icon: HiUsers,
  },
  {
    name: "Contact Us",
    path: "/admin/contact-us",
    icon: FiHeadphones,
    submenu: [
      {
        name: "Customer",
        path: "/admin/contact-us/customer",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "System Details",
        path: "/admin/contact-us/system-details",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "General Settings",
    path: "/admin/general-settings",
    icon: RiSettings4Line,
  },
  {
    name: "Developer Settings",
    path: "/admin/devloper-settings",
    icon: MdDeveloperMode,
    submenu: [
      {
        name: "Terms and Condition",
        path: "/admin/developer-settings/terms-and-condition",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Privacy Policy",
        path: "/admin/developer-settings/privacy-policy",
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
    <Sidebar className="flex-grow h-[100vh] pt-16">
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
