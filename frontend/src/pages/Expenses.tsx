import { toast } from "react-toastify";
import { ActionFunctionArgs } from "react-router-dom";
import { ReactElement } from "react";
import { AxiosError } from "axios";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";

import { addExpense, deleteExpense, getExpenses } from "../utils/CRUDs";
import { DashboardData, ExpenseData } from "../types/APIDATA";
import Table from "../components/Table";
import AddForm from "../components/Form";
import { PieChart } from "../components/Charts";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { intend, ...data } = requestData;
  if (intend === "newExpense") {
    try {
      const res = await addExpense(data);
      if ((await res.status) === 201) {
        return toast.success("Expense added!");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // The server responded with a status code that is not 2xx
          return toast.error(error.response.data.message);
        } else {
          return toast.error("Something went very wrong!");
        }
      }
    }
  }
  if (intend === "deleteExpense") {
    try {
      const res = await deleteExpense(data.id);
      if ((await res.status) === 204) {
        return toast.success("Expense deleted!");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          // The server responded with a status code that is not 2xx
          return toast.error(error.response.data.message);
        } else {
          return toast.error("Something went very wrong!");
        }
      }
    }
  }
}

async function loader() {
  try {
    const res = await getExpenses();
    if (res.status === 200) {
      return res.data.data.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // The server responded with a status code that is not 2xx
        toast.error(error.response.data.message);
        return null;
      } else {
        // no server response
        toast.error("There was a problem loading dashboard!");
        return null;
      }
    }
  }
}

function Expenses(): ReactElement {
  const expenseData = useLoaderData() as ExpenseData[];
  const dashboardData = useRouteLoaderData("root") as DashboardData;
  const budgetsList = dashboardData.budgets.map(({ name, _id }) => ({
    name,
    code: _id,
  }));

  return (
    <div className="w-full min-h-screen p-3 mx-auto relative">
      <div className="w-full flex flex-col sm:flex-row justify-around">
        {expenseData.length > 0 && (
          <div className="w-full sm:w-1/2 lg:w-2/5 bg-white p-4 m-1 border border-stone-200 rounded-md">
            <PieChart
              title="Shares of each budget from total expense"
              label="Share of expenses"
              data={dashboardData.budgets.map((budget) => budget.spent)}
              labels={dashboardData.budgets.map((budget) => budget.name)}
            />
          </div>
        )}
        <div className="w-full sm:w-1/2 lg:w-2/5 m-1 bg-white p-4 border border-stone-200 rounded-md">
          <AddForm intend="newExpense" categoryItems={budgetsList} />
        </div>
      </div>
      {expenseData.length > 0 && (
        <div className="mt-6">
          <hr className="border-stone-300" />
          <h2 className="text-xl font-bold my-4">Recent Expenses</h2>
          <p className="text-lg font-bold my-4">
            Total Expense:{" "}
            {expenseData.reduce((total, value) => total + value.amount, 0)}
          </p>
          <Table
            categories={budgetsList}
            showCategory={true}
            showDelete={true}
            tableData={expenseData}
            tableType="expense"
          />
        </div>
      )}
    </div>
  );
}

export { action, loader };
export default Expenses;
