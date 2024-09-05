import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import { UserProvider } from "./context/userContext";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <>
    <Toaster position="bottom-right" />
    <UserProvider>
      <Flowbite theme={{ theme }}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Flowbite>
    </UserProvider>
  </>
);
