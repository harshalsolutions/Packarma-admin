import type { CustomFlowbiteTheme } from "flowbite-react";

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    color: {
      lime: "bg-lime-100 text-lime-800 dark:bg-lime-200 dark:text-lime-800 group-hover:bg-lime-200 dark:group-hover:bg-lime-300",
    },
    icon: {
      off: "rounded-full px-2 py-1",
    },
    size: {
      xl: "px-3 py-2 text-base rounded-md",
    },
  },
  button: {
    color: {
      lime: "text-white bg-lime-700 hover:bg-lime-800 focus:ring-lime-300 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800",
    },
    outline: {
      on: "transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit",
    },
    size: {
      md: "text-sm px-3 py-2",
    },
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-xl divide-y divide-gray-100 shadow",
      content: "rounded-xl text-sm text-gray-700 dark:text-gray-200",
      target: "w-fit dark:text-white",
    },
    content: "",
  },
  modal: {
    content: {
      inner: "relative rounded-lg bg-white shadow dark:bg-gray-800",
    },
    header: {
      base: "flex items-start justify-between rounded-t px-5 pt-5",
    },
  },
  navbar: {
    base: "fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700",
  },
  sidebar: {
    base: "flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700",
  },
  textarea: {
    base: "block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  toggleSwitch: {
    toggle: {
      checked: {
        off: "!border-gray-200 !bg-gray-200 dark:!border-gray-600 dark:!bg-gray-700",
      },
    },
  },
};

export default flowbiteTheme;
