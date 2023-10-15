import { ReactElement, useState } from "react";
import { toast } from "react-toastify";
import {
  Link,
  redirect,
  useFetcher,
  ActionFunctionArgs,
} from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "./../utils/authentication";
import catchAsync from "../utils/catchAsync";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  return catchAsync(async () => {
    const res = await login(requestData);
    if (res.status === 200) {
      toast.success(`Welcome, ${res.data.data.user.name}!`);
      return redirect("/dashboard/home");
    }
  });
}

function Login(): ReactElement {
  const fetcher = useFetcher();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
      action: "/auth/login",
      encType: "application/json",
    });
  };

  return (
    <div className="m-auto w-10/12 md:w-8/12 py-5">
      <h1 className="text-2xl text-center mb-5 font-bold text-slate-800">
        Log in to your Pocket account
      </h1>
      <form onSubmit={submitHandler}>
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
        <Button
          accent="blue"
          text="Log in"
          type="submit"
          customClasses="w-full my-5"
        />
      </form>
      <span className="text-sm">
        Don't have an account?{" "}
        <Link className="text-blue-600 underline" to="/auth/signup">
          Sign up
        </Link>
      </span>
    </div>
  );
}

export { action };
export default Login;
