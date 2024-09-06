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
    path: "/customer",
    icon: HiUsers,
    submenu: [
      {
        name: "User List",
        path: "/customer/user-list",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "User Address List",
        path: "/customer/user-address-list",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Refer",
        path: "/customer/refer",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "User Subscription",
        path: "/customer/user-subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Download Subscription",
        path: "/customer/download-subscription",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Credit Purchase",
        path: "/customer/credit-purchase",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Customer Enquiry",
        path: "/customer/enquiry",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
  },
  {
    name: "Staff",
    path: "/staff",
    icon: HiUsers,
    submenu: [
      {
        name: "Manage Roles",
        path: "/staff/roles",
        icon: VscDebugBreakpointDataUnverified,
      },
      {
        name: "Manage Staff",
        path: "/staff/manage",
        icon: VscDebugBreakpointDataUnverified,
      },
    ],
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
];
const SidebarComponent: FC = function () {
  const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const renderMenuItem = (item: MenuItem) => (
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
          onClick={() => navigate(item.path)}
          icon={({ className }: { className: string }) => (
            <item.icon
              className={`${className} ${
                item.path === currentPage ? "text-black" : ""
              }`}
            />
          )}
          className={`${
            item.name !== "Dashboard" ? "!pl-2 !text-sm" : "font-medium"
          } ${
            item.path === currentPage ? "bg-lime-500 hover:bg-lime-500" : ""
          } cursor-pointer`}
        >
          <span className="whitespace-normal">{item.name}</span>
        </Sidebar.Item>
      )}
    </div>
  );

  return (
    <Sidebar className="lg:w-[24%] flex-grow h-[100vh] pt-16">
      <div className="flex flex-col justify-between">
        <Sidebar.Items>
          <Sidebar.ItemGroup>{menuItems.map(renderMenuItem)}</Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
