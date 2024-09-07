import React, { useState } from "react";
import { Permission } from "../context/userContext";
import { MdClose } from "react-icons/md";
import { BACKEND_API_KEY } from "../../utils/ApiKey";
import api from "../../utils/axiosInstance";
import ToggleSwitch from "./ToggleSwitch";
import { AiOutlineDelete } from "react-icons/ai";
import CustomPopup from "./CustomPopup";

type PermissionType =
  | "can_create"
  | "can_read"
  | "can_update"
  | "can_delete"
  | "can_export";

interface PermissionsPopupProps {
  permissions: Permission[];
  onClose: () => void;
}

const PermissionsPopup: React.FC<PermissionsPopupProps> = ({
  permissions,
  onClose,
}) => {
  const [localPermissions, setLocalPermissions] = useState(permissions);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [permissionIdToDelete, setPermissionIdToDelete] = useState<
    number | null
  >(null);

  const handleToggle = async (
    pageName: string,
    permissionType: PermissionType
  ) => {
    const updatedPermissions = localPermissions.map((permission: Permission) =>
      permission.page_name === pageName
        ? {
            ...permission,
            [permissionType]: permission[permissionType] === 1 ? 0 : 1,
          }
        : permission
    );

    setLocalPermissions(updatedPermissions);

    const updatedPermission = updatedPermissions.find(
      (permission) => permission.page_name === pageName
    );

    if (updatedPermission) {
      try {
        await api.put(
          `${BACKEND_API_KEY}/staff/permissions/${updatedPermission.permission_id}`,
          {
            [permissionType]: updatedPermission[permissionType],
            page_id: updatedPermission.page_id,
          }
        );
      } catch (error) {
        console.error("Failed to update permission", error);
        setLocalPermissions(permissions);
      }
    } else {
      console.error("Updated permission not found");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(
        `${BACKEND_API_KEY}/staff/permissions/${permissionIdToDelete}`
      );
      setLocalPermissions(
        localPermissions.filter(
          (permission) => permission.permission_id !== permissionIdToDelete
        )
      );
      setDeletePopupOpen(false);
    } catch (error) {
      console.error("Failed to delete permission", error);
      setLocalPermissions(permissions);
    }
  };

  const deletePermission = (id: number) => {
    setPermissionIdToDelete(id);
    setDeletePopupOpen(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Permissions</h2>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-900"
          >
            <MdClose size={24} />
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-900">
          <thead className="text-xs text-gray-900 uppercase bg-gray-200 rounded-md">
            <tr>
              <th className="px-4 py-2">Page Name</th>
              <th className="px-4 py-2 text-center">Create</th>
              <th className="px-4 py-2 text-center">Read</th>
              <th className="px-4 py-2 text-center">Update</th>
              <th className="px-4 py-2 text-center">Delete</th>
              <th className="px-4 py-2 text-center">Export</th>
              <th className="px-4 py-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {localPermissions.map((permission) => (
              <tr key={permission.page_name} className="border-b">
                <td className="px-4 py-3">{permission.page_name}</td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    checked={permission.can_create === 1}
                    onChange={() =>
                      handleToggle(permission.page_name, "can_create")
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    checked={permission.can_read === 1}
                    onChange={() =>
                      handleToggle(permission.page_name, "can_read")
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    checked={permission.can_update === 1}
                    onChange={() =>
                      handleToggle(permission.page_name, "can_update")
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    checked={permission.can_delete === 1}
                    onChange={() =>
                      handleToggle(permission.page_name, "can_delete")
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <ToggleSwitch
                    checked={permission.can_export === 1}
                    onChange={() =>
                      handleToggle(permission.page_name, "can_export")
                    }
                  />
                </td>
                <td className="px-4 py-3 flex justify-center items-center">
                  <button
                    onClick={() => deletePermission(permission.permission_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletePopupOpen && (
        <CustomPopup
          title="Delete Permission"
          description="Are you sure you want to delete this permission?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletePopupOpen(false)}
        />
      )}
    </div>
  );
};

export default PermissionsPopup;
