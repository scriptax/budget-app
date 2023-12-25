import { ChangeEvent, ReactElement, useState } from "react";
import { FaUser, FaKey } from "react-icons/fa6";
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
import { updateData, updatePassword } from "../utils/authentication";
import catchAsync from "../utils/catchAsync";

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
    <div className="rounded-md border border-stone-200 p-3 w-full md:w-4/5 lg:w-5/12 my-4 mx-auto">
      <h2 className="font-bold text-slate-800">
        <FaKey className="inline-block" size={20} />
        <span className="font-bold text-lg ml-2">Password Change</span>
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
    <div className="rounded-md border border-stone-200 p-3 w-full md:w-4/5 lg:w-5/12 my-10 mx-auto">
      <h2 className="font-bold text-slate-800">
        <FaUser className="inline-block" size={25} />
        <span className="font-bold text-lg ml-2">Your Account Info</span>
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
          placeholder="Current balance (change it if you haven't entered it before!)"
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

function Account(): ReactElement {
  return (
    <section className="w-full p-4 bg-white">
      <UserForm />
      <PasswordForm />
    </section>
  );
}

export { action };
export default Account;
