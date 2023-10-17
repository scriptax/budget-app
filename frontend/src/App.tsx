import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout, { loader as rootLoader } from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Account, { action as accountAction } from "./pages/Account";
import Expenses from "./pages/Expenses";
import Login, { action as loginAction } from "./pages/Login";
import Signup, { action as signupAction } from "./pages/Signup";
import {
  action as expensesAction,
  loader as expensesLoader,
} from "./pages/Expenses";
import BudgetPage, {
  loader as budgetLoader,
  action as budgetAction,
} from "./pages/Budget";
import {
  action as incomesAction,
  loader as incomesLoader,
} from "./pages/Incomes";
import Stats, {
  action as statsAction,
  loader as statsLoader,
} from "./pages/Stats";
import { action as dashboardAction } from "./pages/Dashboard";
import logoutLoader from "./actions/logout";
import Incomes from "./pages/Incomes";
// import Error from "./pages/Error";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      // errorElement={<Error />}
      id="root"
      loader={rootLoader}
    >
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route path="home" element={<Dashboard />} action={dashboardAction} />
        <Route
          path="home/budget/:id"
          element={<BudgetPage />}
          loader={budgetLoader}
          action={budgetAction}
        />
        <Route
          path="expenses"
          element={<Expenses />}
          action={expensesAction}
          loader={expensesLoader}
        />
        <Route
          path="incomes"
          element={<Incomes />}
          action={incomesAction}
          loader={incomesLoader}
        />
        <Route
          path="stats"
          element={<Stats />}
          action={statsAction}
          loader={statsLoader}
        />
        <Route path="account" element={<Account />} action={accountAction} />
        <Route path="logout" loader={logoutLoader} />
      </Route>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} action={loginAction} />
        <Route path="signup" element={<Signup />} action={signupAction} />
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

export default App;
