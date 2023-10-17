import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from "../utils/authentication";
import catchAsync from "../utils/catchAsync";

async function logoutLoader() {
  return catchAsync(async () => {
    console.log("Logging out");
    await logout();
    toast.success("Successfully logged out!");
    return redirect("/auth/login");
  });
}

export default logoutLoader;
