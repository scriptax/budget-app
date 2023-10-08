import { ReactElement } from "react";
import { Outlet, Navigate, useLoaderData } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

import { getDashboard } from "../utils/authentication";

async function loader() {
  try {
    const res = await getDashboard();
    if (res.status === 200) {
      return res.data.data.user;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // The server responded with a status code that is not 2xx
        toast.error(error.response.data.message);
        return null;
      } else {
        // no server response
        toast.error("There was a problem loading dashboard!");
        return null;
      }
    }
  }
}

function RootLayout(): ReactElement {
  const dashboard = useLoaderData();
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
