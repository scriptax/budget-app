import { ChangeEvent, ReactElement, useState } from "react";
import { FaUser, FaKey, FaTriangleExclamation } from "react-icons/fa6";
import { TiUserDelete } from "react-icons/ti";
import { toast } from "react-toastify";
import {
  ActionFunctionArgs,
  redirect,
  useFetcher,
  useRouteLoaderData,
} from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import { DashboardData } from "../types/APIDATA";
import {
  deleteAccount,
  updateData,
  updatePassword,
} from "../utils/authentication";
import catchAsync from "../utils/catchAsync";
import ConfirmModal from "../components/ConfirmModal";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { intend, ...data } = requestData;

  if (intend === "updateData") {
    return catchAsync(
      async () => {
        const res = await updateData(data);
        if (res.status === 200) {
          toast.success(`Account data updated!`);
          return redirect("/dashboard/home");
        }
      },
      { showToast: true },
    );
  }
  if (intend === "updatePassword") {
    return catchAsync(
      async () => {
        const res = await updatePassword(data);
        if (res.status === 200) {
          toast.success(`Account password updated!`);
          return redirect("/dashboard/home");
        }
      },
      { showToast: true },
    );
  }
  if (intend === "deleteAccount") {
    return catchAsync(
      async () => {
        const res = await deleteAccount();
        if (res.status === 204) {
          toast.success(`Account deleted successfully!`);
          return redirect("/auth/login");
        }
      },
      { showToast: true },
    );
  }
}

const PasswordForm = (): ReactElement => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    const actionData = { ...formData, intend: "updatePassword" };
    fetcher.submit(actionData, {
      method: "post",
      encType: "application/json",
    });
  };
  return (
    <div className="p-3 w-full md:w-4/5 lg:w-5/12 my-10 mx-auto">
      <h2 className="font-bold text-slate-800">
        <FaKey className="inline-block" size={20} />
        <span className="font-bold text-lg ml-2">Change Password</span>
      </h2>
      <form onSubmit={submitHandler}>
        <Input
          name="password"
          placeholder="Current password"
          type="password"
          value={formData.password}
          changeHandler={changeHandler}
          customClass="w-full my-3"
        />
        <Input
          name="newPassword"
          placeholder="New password"
          type="password"
          value={formData.newPassword}
          changeHandler={changeHandler}
          customClass="w-full my-3"
        />
        <Input
          name="confirmPassword"
          placeholder="Confirm new password"
          type="password"
          value={formData.confirmPassword}
          changeHandler={changeHandler}
          customClass="w-full my-3"
        />
        <Button
          accent="blue"
          text={isSubmitting ? "Updating..." : "Update password"}
          type="submit"
          customClasses="w-full my-3"
        />
      </form>
    </div>
  );
};

const UserForm = (): ReactElement => {
  const dashboardData = useRouteLoaderData("root") as DashboardData;

  if (!dashboardData) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [formData, setFormData] = useState({
    name: dashboardData.name,
    email: dashboardData.email,
    currentBalance: dashboardData.currentBalance,
    // preferredCurrency: "",
  });
  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    const actionData = { ...formData, intend: "updateData" };
    fetcher.submit(actionData, {
      method: "post",
      encType: "application/json",
    });
  };

  return (
    <div className=" p-3 w-full md:w-4/5 lg:w-5/12 my-10 mx-auto">
      <h2 className="font-bold text-slate-800">
        <FaUser className="inline-block" size={25} />
        <span className="font-bold text-lg ml-2">Account Info</span>
      </h2>
      <form onSubmit={submitHandler}>
        <Input
          name="name"
          placeholder="Full name"
          type="text"
          value={formData.name}
          changeHandler={changeHandler}
          customClass="w-full my-3"
        />
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          changeHandler={changeHandler}
          customClass="w-full my-3"
        />
        <Input
          name="currentBalance"
          placeholder="Current balance (change it only once!)"
          type="number"
          value={formData.currentBalance}
          changeHandler={changeHandler}
          customClass="w-full my-3 float-left"
          required={false}
        />
        <Button
          accent="blue"
          text={isSubmitting ? "Updating..." : "Update account"}
          type="submit"
          customClasses="w-full my-3"
        />
      </form>
    </div>
  );
};

const DeleteAccountForm = (): ReactElement => {
  const [warning, setWarning] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const submitHandler = () => {
    const actionData = { intend: "deleteAccount" };
    fetcher.submit(actionData, {
      method: "post",
      encType: "application/json",
    });
  };

  return (
    <div className="p-3 w-full md:w-4/5 lg:w-5/12 my-10 mx-auto">
      <h2 className="font-bold text-slate-800">
        <TiUserDelete className="inline-block" size={30} />
        <span className="font-bold text-lg ml-2">Delete Account</span>
      </h2>
      <p className="mt-2 text-sm">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <Button
        accent="red"
        text={isSubmitting ? "Deleting..." : "Delete Your Account"}
        type="submit"
        customClasses="w-full my-3"
        Icon={FaTriangleExclamation}
        onClick={() => {
          setWarning(true);
        }}
      />
      {warning && (
        <ConfirmModal
          message="Are you sure you want to delete your account?"
          confirmAccent="red"
          confirmText={isSubmitting ? "Deleting..." : "Yes"}
          proceed={submitHandler}
          cancel={() => {
            setWarning(false);
          }}
        />
      )}
    </div>
  );
};

function Account(): ReactElement {
  return (
    <section className="w-full p-4 bg-white min-h-screen">
      <UserForm />
      <hr className="border-stone-300 w-2/3 m-auto" />
      <PasswordForm />
      <hr className="border-stone-300 w-2/3 m-auto" />
      <DeleteAccountForm />
    </section>
  );
}

export { action };
export default Account;
