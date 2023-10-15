import { ReactElement, useState } from "react";
import { GiPayMoney } from "react-icons/gi";
import { toast } from "react-toastify";
import { useRouteLoaderData, ActionFunctionArgs, Link } from "react-router-dom";
import {
  FaSackDollar,
  FaMoneyBill1,
  FaMoneyCheckDollar,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";

import SummaryCard from "../components/SummaryCard";
import BudgetCard from "../components/BudgetCard";
import Button from "../components/Button";
import { addBudget, addExpense, addIncome } from "../utils/CRUDs";
import { BudgetData, DashboardData } from "../types/APIDATA";
import AddForm from "../components/Form";
import { budgetCategories, incomeCategories } from "../data/defaultData";
import catchAsync from "../utils/catchAsync";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { intend, ...data } = requestData;

  if (intend === "newBudget") {
    return catchAsync(async () => {
      const res = await addBudget(data);
      if ((await res.status) === 201) {
        return toast.success("Budget created!");
      }
    });
  }
  if (intend === "newExpense") {
    return catchAsync(async () => {
      const res = await addExpense(data);
      if ((await res.status) === 201) {
        return toast.success("Expense added!");
      }
    });
  }
  if (intend === "newIncome") {
    return catchAsync(async () => {
      const res = await addIncome(data);
      if ((await res.status) === 201) {
        return toast.success("Income added!");
      }
    });
  }
}

type FormLayerPropsTypes = {
  budgets: BudgetData[];
};
function FormLayer({ budgets }: FormLayerPropsTypes): ReactElement {
  const [form, setForm] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const budgetsList = budgets.map(({ name, _id }) => ({ name, code: _id }));
  return (
    <>
      <button
        className="fixed right-10 bottom-10 w-12 h-12 z-20 rounded-[25px] bg-slate-900 text-slate-200 cursor-pointer shadow-xl active:scale-90 transition-transform"
        onClick={() => {
          setForm("none");
          setShowMenu(true);
        }}
      >
        <FaPlus
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          size={20}
        />
      </button>

      {form && (
        <div
          className="absolute left-0 top-0 w-full h-full z-10 bg-[#0006]"
          onClick={() => {
            setForm((prev) => (prev !== "none" ? prev : ""));
          }}
        >
          {showMenu && (
            <ul
              className={`fixed z-10 right-10 bottom-24 text-md overflow-y-auto rounded-md w-40 bg-slate-100 max-h-40 transition-transform origin-bottom`}
            >
              {["Create budget", "Add expense", "Add income"].map(
                (item, index) => (
                  <li
                    key={index}
                    onClick={(e: React.MouseEvent<HTMLLIElement>) => {
                      e.stopPropagation();
                      setForm(item);
                      setShowMenu(false);
                    }}
                    className="py-2 cursor-pointer hover:bg-slate-800 hover:text-white pl-3"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          )}
          {form !== "none" && (
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/2 lg:w-1/3 p-5 rounded-md bg-white">
              <button
                className="absolute right-2 top-2 w-10 h-10 rounded-3xl grid place-content-center hover:bg-slate-200"
                onClick={() => {
                  setForm("");
                }}
              >
                <FaXmark size={20} />
              </button>
              {form === "Create budget" ? (
                <AddForm intend="newBudget" categoryItems={budgetCategories} />
              ) : form === "Add expense" ? (
                <AddForm intend="newExpense" categoryItems={budgetsList} />
              ) : form === "Add income" ? (
                <AddForm intend="newIncome" categoryItems={incomeCategories} />
              ) : (
                <></>
              )}
              <Button
                accent="slate"
                text="Cancel"
                customClasses="w-full my-2"
                onClick={() => {
                  setForm("");
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Dashboard() {
  const dashboard = useRouteLoaderData("root") as DashboardData;
  const totalBudgeted = dashboard.budgets.reduce(
    (acc, { amount }) => acc + amount,
    0,
  );

  return (
    <section className="p-4 w-full h-full relative min-h-screen scrollbar">
      <div className="grid grid-cols-2 md:grid-cols-4 mb-5">
        <SummaryCard
          Icon={FaSackDollar}
          title="Current Balance"
          text={`$${dashboard.currentBalance}`}
          customClasses="bg-slate-800"
        />
        <SummaryCard
          Icon={FaMoneyCheckDollar}
          title="Total Budgeted"
          text={`$${totalBudgeted}`}
          customClasses="bg-blue-500"
        />
        <SummaryCard
          Icon={GiPayMoney}
          title="Last month's expense"
          text={`$${dashboard.totalExpense}`}
          customClasses="bg-orange-500"
        />
        <SummaryCard
          Icon={FaMoneyBill1}
          title="Last month's income"
          text={`$${dashboard.totalIncome}`}
          customClasses="bg-emerald-700"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {dashboard.budgets.map(({ name, category, amount, spent, _id }, index) => (
          <Link to={`budget/${_id}`} className="m-1 bg-white rounded-lg border border-stone-200 shadow-md block hover:-translate-y-1 transition-transform cursor-pointer">
            <BudgetCard
              key={index}
              name={name}
              category={category}
              amount={amount}
              spent={spent ?? 0}
            />
          </Link>
        ))}
      </div>
      <FormLayer budgets={dashboard.budgets} />
    </section>
  );
}

export { action };
export default Dashboard;
