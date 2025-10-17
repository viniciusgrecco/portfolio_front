// router.tsx
import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import { Homepage } from "./pages/homepage/Homepage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin/homepage",
    element: <Homepage />,
  },
  {
    path: "*",
    loader: () => redirect('/'),
  },
]);