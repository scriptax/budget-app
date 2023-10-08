import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from "../utils/authentication";

async function logoutAction() {
  try {
    console.log("Logging OUT");
    await logout();
    toast.success("Successfully logged out!");
    return redirect("/auth/login");
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default logoutAction;
