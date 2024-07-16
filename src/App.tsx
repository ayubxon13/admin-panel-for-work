import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import Staffs from "./pages/Staffs";
import RootLayout from "./layout/RootLayout";
import Login from "./pages/Login";
import ProtectedRoutes from "./layout/ProtectedLayout";
import Service from "./pages/Service";
import Partners from "./pages/Partners";

function App() {
  const userData = localStorage.getItem("token");

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes user={userData}>
          <RootLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <HomeLayout />,
        },
        {
          path: "/staffs",
          element: <Staffs />,
        },
        {
          path: "/service",
          element: <Service />,
        },
        {
          path: "/partners",
          element: <Partners />,
        },
      ],
    },
    {
      path: "/login",
      element: userData ? <Navigate to="/" /> : <Login />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
