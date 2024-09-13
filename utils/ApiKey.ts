export const BACKEND_API_KEY =
  import.meta.env["VITE_ENV"] === "DEV"
    ? "http://localhost:5000/api/admin"
    : import.meta.env["VITE_ADMIN_BACKEND_LINK"] + "/api/admin";

export const BACKEND_MEDIA_LINK =
  import.meta.env["VITE_ENV"] === "DEV"
    ? "http://localhost:5000"
    : import.meta.env["VITE_ADMIN_BACKEND_LINK"];
