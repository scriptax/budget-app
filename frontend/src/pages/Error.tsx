import { ReactElement } from "react";
import { Link, useRouteError } from "react-router-dom";
import graphic from "./../assets/images/error-graphic.png";
import Button from "../components/Button";
import { FaHouse } from "react-icons/fa6";

function Error(): ReactElement {
  const error = useRouteError() as object;
  console.log("The error says: ", error);

  let message = { text: "", code: 0 };

  if ("status" in error) {
    switch (error.status) {
      case 404:
        message.text = "The page you are looking for doesn't exist!";
        message.code = 404;
        break;

      case 401:
        message.text = "You aren't authorized to see this page.";
        message.code = 401;
        break;

      case 503:
        message.text = "Something went wrong. Our bad!";
        message.code = 503;
        break;
    }
  }

  return (
    <div className="text-center text-slate-950 font-primary bg-slate-50 min-h-screen">
      <div className="m-auto sm:w-1/2">
        <img
          src={graphic}
          alt="error"
          width={300}
          height={300}
          className="m-auto"
        />
        <h1 className="text-8xl font-bold">{message.code}</h1>
        <h2 className="mt-4 text-2xl">Uh oh!</h2>
        <p className="text-xl mt-2 text-slate-700">{message.text}</p>
        <Link to="/dashboard/home">
          <Button
            accent="slate"
            text="Go Home"
            customClasses="mt-5"
            Icon={FaHouse}
          />
        </Link>
      </div>
    </div>
  );
}

export default Error;
