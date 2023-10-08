import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

import graphic from "./../assets/images/auth-graphic.png";

function AuthLayout(): ReactElement {
  return (
    <div className="w-full flex flex-col-reverse md:flex-row md:justify-center md:items-center md:h-screen md:m-auto">
      <section className="text-white w-full md:w-1/2">
        <img
          className="m-auto"
          src={graphic}
          alt="Pocket app"
          draggable="false"
        />
      </section>
      <section className="w-full md:w-1/2">
        <Outlet />
      </section>
    </div>
  );
}

export default AuthLayout;
