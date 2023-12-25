import { ReactElement, useEffect, useRef, useState } from "react";
import { FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";
import { GiPayMoney, GiHamburgerMenu } from "react-icons/gi";
import {
  FaHouse,
  FaMoneyBill1,
  FaChartBar,
  FaUserGear,
  FaXmark,
  FaCircleUser,
} from "react-icons/fa6";
import {
  NavLink,
  Outlet,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { IconType } from "react-icons/lib";
import LoadingBar from "react-top-loading-bar";

import logo from "./../assets/images/logo.svg";
import { DashboardData } from "../types/APIDATA";

const links = [
  { text: "Home", path: "/dashboard/home", icon: FaHouse },
  { text: "Expenses", path: "/dashboard/expenses", icon: GiPayMoney },
  { text: "Incomes", path: "/dashboard/incomes", icon: FaMoneyBill1 },
  { text: "Stats", path: "/dashboard/stats", icon: FaChartBar },
  { text: "Account", path: "/dashboard/account", icon: FaUserGear },
  { text: "Log out", path: "/dashboard/logout", icon: FaSignOutAlt },
];

type LinkType = {
  text: string;
  path: string;
  Icon: IconType;
  onClick: () => void;
};
const linkStyles = {
  active:
    "text-slate-100 px-5 py-3 text-lg block w-full hover:bg-slate-900 my-4 border-r-4 border-blue-600 bg-slate-900",
  notActive:
    "text-slate-300 px-5 py-3 text-lg block w-full hover:bg-slate-900 my-4",
};
const Link = ({ text, path, Icon, onClick }: LinkType): ReactElement => {
  return (
    <NavLink
      onClick={onClick}
      className={({ isActive }) => {
        return isActive ? linkStyles.active : linkStyles.notActive;
      }}
      to={path}
    >
      <Icon className="float-left mr-2" size={25} />
      <span>{text}</span>
    </NavLink>
  );
};

function DashboardLayout(): ReactElement {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const dashboard = useRouteLoaderData("root") as DashboardData;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const loadRef = useRef<any>(null);

  useEffect(() => {
    if (isLoading) {
      loadRef.current.continuousStart();
    } else {
      loadRef.current.complete();
    }
  }, [isLoading]);
  return (
    <div className="flex">
      <aside
        className={`fixed z-30 md:sticky -left-72 w-72 md:w-3/12 lg:w-2/12 top-0 md:left-0 bg-slate-950 h-screen ${
          showSidebar && "left-0"
        } overflow-x-hidden transition-[left]`}
      >
        <div className="text-white text-lg px-5 mt-5 mb-16 flex justify-between items-center">
          <NavLink to="/dashboard/home">
            <img className="w-32" src={logo} alt="Logo" draggable="false" />
          </NavLink>
          <FaXmark
            onClick={() => {
              setShowSidebar(false);
            }}
            className="hover:bg-slate-800 cursor-pointer block md:hidden"
            size={25}
          />
        </div>
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              text={link.text}
              path={link.path}
              Icon={link.icon}
              onClick={() => {
                setShowSidebar(false);
              }}
            />
          );
        })}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-300 whitespace-nowrap text-xs text-center">
          © {new Date().getFullYear()} by
          <a
            href="https://github.com/scriptax"
            target="blank"
            className="underline mb-1"
          >
            {" Majid Moradi."}
          </a>
          <br />
          <a
            href="https://github.com/scriptax/budget-app"
            target="blank"
            className="underline"
          >
            Github code
          </a>
        </div>
      </aside>
      <section className="w-full md:w-9/12 lg:w-10/12">
        <header className="h-16 bg-slate-950 w-full text-white flex justify-between items-center">
          <div className="px-5 flex items-center">
            <GiHamburgerMenu
              onClick={() => {
                setShowSidebar(true);
              }}
              className="cursor-pointer md:hidden mr-4"
              size={30}
            />
            <div className="flex flex-row items-center max-sm:hidden">
              <FaCalendarAlt size={20} className="mr-2" />
              {new Date().toLocaleDateString("en-us", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="px-5 text-md">
            <NavLink to="/dashboard/account" className="text-md">
              <FaCircleUser className="inline-block mr-2" size={30} />
              <span className="inline-block">
                {dashboard?.name ?? "No name"}
              </span>
            </NavLink>
          </div>
        </header>
        <main className="w-full bg-stone-50 ">
          <Outlet />
        </main>
      </section>
      <LoadingBar color="#2563eb" height={3} ref={loadRef} />
    </div>
  );
}

export default DashboardLayout;
