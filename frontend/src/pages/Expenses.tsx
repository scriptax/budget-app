import { toast } from "react-toastify";
import { ActionFunctionArgs } from "react-router-dom";
import { ReactElement } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";

import { addExpense, deleteExpense, getExpenses } from "../utils/CRUDs";
import { DashboardData, ExpenseData } from "../types/APIDATA";
import Table from "../components/Table";
import AddForm from "../components/Form";
import { PieChart } from "../components/Charts";
import catchAsync from "../utils/catchAsync";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { intend, ...data } = requestData;

  if (intend === "newExpense") {
    return catchAsync(
      async () => {
        const res = await addExpense(data);
        if ((await res.status) === 201) {
          return toast.success("Expense added!");
        }
      },
      { showToast: true },
    );
  }
  if (intend === "deleteExpense") {
    return catchAsync(
      async () => {
        const res = await deleteExpense(data.id);
        if ((await res.status) === 204) {
          return toast.success("Expense deleted!");
        }
      },
      { showToast: true },
    );
  }
}

async function loader() {
  return catchAsync(async () => {
    const res = await getExpenses();
    if (res.status === 200) {
      return res.data.data.data;
    }
  });
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
      <div className="w-full flex flex-col sm:flex-row justify-around items-center sm:items-stretch">
        {expenseData.length > 0 && (
          <div className="w-full sm:w-1/2 lg:w-2/5 h-72 bg-white p-4 m-1 border border-stone-200 rounded-md">
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
          <h2 className="text-lg font-bold my-4">Recent Expenses</h2>
          <p className="text-md font-bold my-4">
            Total Expense:{" $"}
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
