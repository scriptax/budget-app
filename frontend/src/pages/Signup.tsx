import { ReactElement, useState } from "react";
import { toast } from "react-toastify";
import {
  ActionFunctionArgs,
  redirect,
  Link,
  useFetcher,
  useRouteLoaderData,
  Navigate,
} from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import { signup } from "../utils/authentication";
import catchAsync from "../utils/catchAsync";
import { DashboardData } from "../types/APIDATA";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  return catchAsync(
    async () => {
      const res = await signup(requestData);
      if (res.status === 201) {
        toast.success(`Welcome, ${res.data.data.user.name}!`);
        return redirect("/dashboard/home");
      }
    },
    { showToast: true },
  );
}

function Signup(): ReactElement {
  const dashboard = useRouteLoaderData("root") as DashboardData;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    currentBalance: 0,
    preferredCurrency: "USD",
  });

  if (dashboard) {
    return <Navigate to="/dashboard/home" />;
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();

    fetcher.submit(formData, {
      method: "post",
      action: "/auth/signup",
      encType: "application/json",
    });
  };

  return (
    <div className="m-auto w-10/12 md:w-11/12 lg:w-8/12 py-5">
      <h1 className="text-2xl text-center mb-5 font-bold text-slate-800">
        Sign up for Pocket to Start Tracking <br />
        Your Expenses Today
      </h1>
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
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          changeHandler={changeHandler}
          customClass="w-full mt-3"
        />
        <span className="text-xs text-slate-500 ">
          Use 8 characters or more
        </span>
        <hr className="my-2 border-slate-400" />
        <Input
          name="currentBalance"
          placeholder="Current balance"
          type="number"
          value={formData.currentBalance}
          changeHandler={changeHandler}
          customClass="w-full my-3"
          required={false}
        />
        <span className="text-xs block text-slate-500 clear-both">
          Your current balance is only used for your personal finance management
          and will not be shared with anyone else. We use security measures to
          keep your data safe (You can skip this step and update it later in
          your settings.)
        </span>
        <Button
          accent="blue"
          text={isSubmitting ? "Creating account..." : "Create account"}
          type="submit"
          customClasses="w-full my-3"
        />
      </form>
      <span className="text-sm">
        Already have an account?{" "}
        <Link className="text-blue-600 underline" to="/auth/login">
          Log in
        </Link>
      </span>
    </div>
  );
}

export { action };
export default Signup;
