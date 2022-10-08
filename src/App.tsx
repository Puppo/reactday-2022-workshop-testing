import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from './pages/Home';
import Repositories from "./pages/Repositories";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/:userId/repositories",
    element: <Repositories />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
