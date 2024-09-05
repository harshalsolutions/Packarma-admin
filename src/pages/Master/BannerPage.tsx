import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { BACKEND_API_KEY, BACKEND_MEDIA_LINK } from "../../../utils/ApiKey";
import EntriesPerPage from "../../components/EntriesComp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsPopup from "../../components/DetailsPopup";
import { toast } from "react-hot-toast";
import { ErrorComp } from "../../components/ErrorComp";
import CustomPopup from "../../components/CustomPopup";
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import ToggleSwitch from "../../components/ToggleSwitch";

interface Banner {
  id: number;
  title: string;
  description: string;
  start_date_time: string;
  end_date_time: string;
  link: string;
  app_page: string;
  banner_image: string;
  status: string;
  total_views: number;
  total_clicks: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const BannerPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [link, setLink] = useState("");
  const [appPage, setAppPage] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState<number | null>(null);
  const [activityLog, setActivityLog] = useState<any>(null);
  useEffect(() => {
    fetchBanners();
  }, [currentPage, entriesPerPage]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_API_KEY}/master/get-banners`,
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
          },
        }
      );
      setBanners(response.data.data.banners || []);
      if (response.data.data.pagination) {
        setPagination(response.data.data.pagination);
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteBanner = (id: string) => {
    setBannerIdToDelete(Number(id));
    setDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bannerIdToDelete !== null) {
      const loadingToast = toast.loading("Deleting banner...");
      try {
        await axios.delete(
          `${BACKEND_API_KEY}/master/delete-banners/${bannerIdToDelete}`
        );
        fetchBanners();
        toast.success("Banner deleted successfully");
      } catch (err) {
        toast.error("Failed to delete banner");
      } finally {
        toast.dismiss(loadingToast);
        setDeletePopupOpen(false);
        setBannerIdToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeletePopupOpen(false);
    setBannerIdToDelete(null);
  };

  const openAddForm = () => {
    setEditingBanner(null);
    setTitle("");
    setDescription("");
    setStartDateTime("");
    setEndDateTime("");
    setLink("");
    setAppPage("");
    setBannerImage(null);
    setStatus("active");
    setIsFormOpen(true);
  };

  const openEditForm = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setDescription(banner.description);
    setStartDateTime(banner.start_date_time);
    setEndDateTime(banner.end_date_time);
    setLink(banner.link);
    setAppPage(banner.app_page);
    setBannerImage(null);
    setStatus(banner.status);
    setIsFormOpen(true);
    setImagePreview(banner.banner_image);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
    setTitle("");
    setDescription("");
    setStartDateTime("");
    setEndDateTime("");
    setLink("");
    setAppPage("");
    setBannerImage(null);
    setStatus("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving banner...");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "start_date_time",
        new Date(startDateTime).toISOString().slice(0, 19).replace("T", " ")
      );
      formData.append(
        "end_date_time",
        new Date(endDateTime).toISOString().slice(0, 19).replace("T", " ")
      );
      formData.append("link", link);
      formData.append("app_page", appPage);
      formData.append("status", status);
      formData.append("type", "banner");
      if (bannerImage) {
        formData.append("banner", bannerImage);
      }

      if (editingBanner) {
        await axios.put(
          `${BACKEND_API_KEY}/master/update-banner/${editingBanner.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Banner updated successfully");
      } else {
        await axios.post(`${BACKEND_API_KEY}/master/add-banner`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Banner added successfully");
      }

      closeForm();
      fetchBanners();
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("Failed to save banner");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${BACKEND_API_KEY}/master/update-banner/${id}`, {
        status: newStatus,
      });
      fetchBanners();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const fetchActivityLog = async (bannerId: number, type: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_API_KEY}/master/banner/activity-log/${bannerId}`
      );
      if (
        type === "clicks" &&
        response.data.data.activityStats.total_clicks > 0
      ) {
        setActivityLog({
          type: type,
          userData: response.data.data.userData[type],
        });
      } else if (
        type === "views" &&
        response.data.data.activityStats.total_views > 0
      ) {
        setActivityLog({
          type: type,
          userData: response.data.data.userData[type],
        });
      }
    } catch (err) {
      toast.dismiss();
    }
  };

  const handleViewClick = (banner: Banner, type: string) => {
    fetchActivityLog(banner.id, type);
  };

  const handleClickClick = (banner: Banner, type: string) => {
    fetchActivityLog(banner.id, type);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 border-l-8 text-black border-lime-500 pl-2">
        Manage Banners
      </h1>
      {!isFormOpen && (
        <button
          onClick={openAddForm}
          className="bg-lime-500 text-black px-4 py-2 rounded mb-4 block ml-auto mr-4"
        >
          Add New Banner
        </button>
      )}
      {!isFormOpen && (
        <>
          <EntriesPerPage
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="xl" />
            </div>
          ) : error ? (
            <ErrorComp error={error} onRetry={fetchBanners} />
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Clicks
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {banners.length > 0 ? (
                    banners.map((banner) => (
                      <tr
                        key={banner.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-4 text-gray-900">{banner.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {banner.title}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <div
                            className="px-2 py-4 text-gray-900 flex justify-start items-start  cursor-pointer"
                            onClick={() => handleViewClick(banner, "views")}
                          >
                            <span>{banner.total_views}</span>
                            {banner.total_views != 0 && (
                              <span className="bg-lime-400 ml-2 px-2 py-1 rounded-full">
                                <MdOutlineRemoveRedEye />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <div
                            className="px-2 py-4 text-gray-900 flex justify-start items-start  cursor-pointer"
                            onClick={() => handleClickClick(banner, "clicks")}
                          >
                            <span>{banner.total_clicks}</span>
                            {banner.total_clicks != 0 && (
                              <span className="bg-lime-400 ml-2 px-2 py-1 rounded-full">
                                <MdOutlineRemoveRedEye />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <img
                            src={BACKEND_MEDIA_LINK + banner.banner_image}
                            alt={banner.title}
                            className="w-16 h-16 object-cover cursor-pointer"
                            onClick={() => setSelectedBanner(banner)}
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          <ToggleSwitch
                            checked={banner.status === "active"}
                            onChange={() =>
                              toggleStatus(banner.id, banner.status)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-right">
                          <button
                            onClick={() => setSelectedBanner(banner)}
                            className="text-2xl text-blue-600 dark:text-blue-500 hover:underline mr-4"
                            aria-label="Info"
                          >
                            <MdOutlineRemoveRedEye />
                          </button>
                          <button
                            onClick={() => openEditForm(banner)}
                            className="text-2xl text-lime-600 dark:text-lime-500 hover:underline mr-3"
                            aria-label="Edit"
                          >
                            <TbEdit />
                          </button>
                          <button
                            onClick={() => deleteBanner(banner.id.toString())}
                            className="text-2xl text-red-600 dark:text-red-500 hover:underline"
                            aria-label="Delete"
                          >
                            <MdDeleteOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No banners found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!error && (
            <p className="my-4 text-sm">
              Showing {banners.length} out of {pagination.totalItems} Banners
            </p>
          )}
          {pagination.totalItems >= 10 && (
            <div className="mt-4 flex justify-center items-center mb-8">
              <button
                className="px-2 py-1 rounded mr-2 disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-2 py-1 rounded border mr-2 ${
                    index + 1 === pagination.currentPage
                      ? "bg-lime-500 text-white"
                      : ""
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 rounded disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {isFormOpen && (
        <div className="mx-auto my-10 w-[80%]">
          <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
            {editingBanner ? "Edit Banner" : "Add New Banner"}
          </h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="start_date_time"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date Time
              </label>
              <input
                type="datetime-local"
                id="start_date_time"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="end_date_time"
                className="block text-sm font-medium text-gray-700"
              >
                End Date Time
              </label>
              <input
                type="datetime-local"
                id="end_date_time"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="link"
                className="block text-sm font-medium text-gray-700"
              >
                Link
              </label>
              <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="app_page"
                className="block text-sm font-medium text-gray-700"
              >
                App Page
              </label>
              <input
                type="text"
                id="app_page"
                value={appPage}
                onChange={(e) => setAppPage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="banner_image"
                className="block text-sm font-medium text-gray-700"
              >
                Banner Image
              </label>
              <input
                type="file"
                id="banner_image"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setBannerImage(file as File | null);
                  } else {
                    setBannerImage(null);
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            {editingBanner && imagePreview && (
              <div className="mb-4">
                <img
                  src={BACKEND_MEDIA_LINK + imagePreview}
                  alt="Banner Preview"
                  className="w-16 h-16 object-cover mb-2"
                />
              </div>
            )}

            <div className="flex justify-end mt-4 items-center">
              <button
                type="button"
                onClick={closeForm}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                {editingBanner ? "Update Banner" : "Add Banner"}
              </button>
            </div>
          </form>
        </div>
      )}
      {selectedBanner && (
        <DetailsPopup
          title="Banner Details"
          fields={[
            { label: "ID", value: selectedBanner.id.toString() },
            { label: "Title", value: selectedBanner.title },
            { label: "Description", value: selectedBanner.description },
            {
              label: "Total Views",
              value: selectedBanner.total_views.toString(),
            },
            {
              label: "Total Clicks",
              value: selectedBanner.total_clicks.toString(),
            },
            { label: "Start Date Time", value: selectedBanner.start_date_time },
            { label: "End Date Time", value: selectedBanner.end_date_time },
            { label: "Link", value: selectedBanner.link },
            { label: "App Page", value: selectedBanner.app_page },
            {
              label: "Banner Image",
              value: (
                <img
                  src={BACKEND_MEDIA_LINK + selectedBanner.banner_image}
                  alt={selectedBanner.title}
                  className="w-24 h-24 object-cover"
                />
              ),
            },
            {
              label: "Status",
              value: selectedBanner.status === "active" ? "Active" : "Inactive",
            },
            {
              label: "Created At",
              value: new Date(selectedBanner.createdAt).toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(selectedBanner.updatedAt).toLocaleString(),
            },
          ]}
          onClose={() => setSelectedBanner(null)}
        />
      )}
      {isDeletePopupOpen && (
        <CustomPopup
          title="Confirm Deletion"
          description="Are you sure you want to delete this banner?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {activityLog && (
        <DetailsPopup
          title={activityLog.type === "views" ? "Views Data" : "Clicks Data"}
          fields={activityLog.userData.map((item: any) => ({
            label: item.firstname + " " + item.lastname,
            value: new Date(item.activity_timestamp).toLocaleString(),
          }))}
          onClose={() => setActivityLog(null)}
        />
      )}
    </div>
  );
};

export default BannerPage;
