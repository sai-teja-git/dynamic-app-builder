import { lazy } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import PageNotFound from './Errors/PageNotFound';
const Page = lazy(() => import("./Pages/Page"))
const DashboardConfig = lazy(() => import("./Pages/Dashboard/Configuration"))
const DashboardView = lazy(() => import("./Pages/Dashboard/View"))
const EChart = lazy(() => import("./Pages/EChart/EChart"))
const MenuConfig = lazy(() => import("./Pages/MenuScreen/MenuConfig"))
const EditMenu = lazy(() => import("./Pages/MenuScreen/EditMenu"))

function App() {

  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Page />,
      children: [
        {
          path: "/dashboard/configuration",
          element: <DashboardConfig />
        },
        {
          path: "/dashboard/view",
          element: <DashboardView />
        },
        {
          path: "/dashboard/e-chart",
          element: <EChart />
        },
        {
          path: "/menu-screen-mapping",
          element: <MenuConfig />
        },
        {
          path: "/edit-menu",
          element: <EditMenu />
        },
      ]
    },
    {
      path: "*", element: <PageNotFound />
    }
  ]

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default App
