import { createBrowserRouter } from "react-router-dom";
import Login from "./apps/auth/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);
