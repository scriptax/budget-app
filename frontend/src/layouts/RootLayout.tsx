import { ReactElement, useEffect } from "react";
import { Outlet, Navigate, useLoaderData, useLocation, useRevalidator } from "react-router-dom";

import { getDashboard } from "../utils/authentication";
import catchAsync from "../utils/catchAsync";

async function loader() {
  return catchAsync(async () => {
    const res = await getDashboard();
    if (res.status === 200) {
      return res.data.data.user;
    }
  });
}

function RootLayout(): ReactElement {
  const dashboard = useLoaderData();
  const location = useLocation();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (location.pathname === "/dashboard/home") {
      revalidator.revalidate();
    }
  }, [location.pathname]);

  return (
    <div className="font-primary">
      <Outlet />
      {dashboard ? (
        <Navigate to="/dashboard/home" replace />
      ) : (
        <Navigate to="/auth/signup" replace />
      )}
    </div>
  );
}

export { loader };
export default RootLayout;
