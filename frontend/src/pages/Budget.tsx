import { ReactElement, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrashCan, FaPen, FaCheckToSlot, FaXmark } from "react-icons/fa6";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useFetcher,
} from "react-router-dom";

import BudgetCard from "../components/BudgetCard";
import { BudgetWithExpenseData } from "../types/APIDATA";
import AddForm from "../components/Form";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import { budgetCategories } from "../data/defaultData";
import Table from "../components/Table";
import {
  deleteBudget,
  getBudget,
  editBudget,
  addExpense,
  closeBudget,
  deleteExpense,
} from "../utils/CRUDs";
import catchAsync from "../utils/catchAsync";

async function loader({ params }: LoaderFunctionArgs) {
  return catchAsync(async () => {
    const res = await getBudget(params.id!);
    if (res.status === 200) {
      return res.data.data.data;
    } else {
      return null;
    }
  });
}

async function action({ params, request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { intend, ...data } = requestData;

  if (intend === "deleteBudget") {
    return catchAsync(
      async () => {
        const res = await deleteBudget(params.id!);
        if ((await res.status) === 204) {
          toast.success("Budget deleted!");
          return redirect("/dashboard/home");
        }
      },
      { showToast: true },
    );
  }
  if (intend === "editBudget") {
    return catchAsync(
      async () => {
        const res = await editBudget({ ...data, id: params.id });
        if ((await res.status) === 200) {
          return toast.success("Budget Edited!");
        }
      },
      { showToast: true },
    );
  }
  if (intend === "closeBudget") {
    return catchAsync(
      async () => {
        const res = await closeBudget({ close: true, id: params.id! });
        if ((await res.status) === 200) {
          toast.success("Budget Closed!");
          return redirect("/dashboard/home");
        }
      },
      { showToast: true },
    );
  }
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

function BudgetPage(): ReactElement {
  const budgetData = useLoaderData() as BudgetWithExpenseData;

  if (!budgetData) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const [manage, setManage] = useState({
    intend: "",
    confirmAccent: "",
    message: "",
    confirmText: "",
    inProgressText: "",
  });

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const submitHandler = (): void => {
    const actionData = manage;
    fetcher.submit(actionData, {
      method: "post",
      encType: "application/json",
    });
  };

  useEffect(() => {
    if (!isSubmitting) {
      setManage((prev) => ({ ...prev, intend: "" }));
    }
  }, [isSubmitting]);

  return (
    <div className="w-full min-h-screen p-3 mx-auto relative">
      <div className="w-full flex flex-col sm:flex-row justify-around items-center sm:items-stretch">
        <div className="w-full sm:w-1/2 lg:w-2/5 bg-white p-4 m-1 border border-stone-200 rounded-md">
          <BudgetCard
            name={budgetData.name}
            amount={budgetData.amount}
            category={budgetData.category}
            spent={budgetData.spent}
            setAt={budgetData.setAt}
          />
          <Button
            accent="slate"
            text="Edit Budget"
            customClasses="w-full mt-2"
            Icon={FaPen}
            onClick={() => {
              setManage((prev) => ({
                ...prev,
                intend: "editBudget",
              }));
            }}
          />
          <Button
            accent="lime"
            text="Close Budget"
            customClasses="w-full mt-2"
            Icon={FaCheckToSlot}
            onClick={() => {
              setManage({
                intend: "closeBudget",
                confirmAccent: "lime",
                message: `Are you sure you want to close "${budgetData.name}"?`,
                confirmText: "Close",
                inProgressText: "Closing...",
              });
            }}
          />
          <Button
            accent="red"
            text="Delete Budget"
            customClasses="w-full mt-2"
            Icon={FaTrashCan}
            onClick={() => {
              setManage({
                intend: "deleteBudget",
                confirmAccent: "red",
                message: `Are you sure you want to delete "${budgetData.name}"?`,
                confirmText: "Delete",
                inProgressText: "Deleteing...",
              });
            }}
          />
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/5 m-1 bg-white p-4 border border-stone-200 rounded-md">
          <AddForm
            intend="newExpense"
            prevCategory={{ code: budgetData._id, name: budgetData.name }}
            categoryItems={[{ name: budgetData.name, code: budgetData._id }]}
          />
        </div>
      </div>
      {budgetData.expenses.length > 0 && (
        <div className="mt-6">
          <hr className="border-stone-300" />
          <h2 className="text-lg font-bold my-4">{budgetData.name} Expenses</h2>
          <Table
            categories={[]}
            showCategory={false}
            showDelete={true}
            tableData={budgetData.expenses}
            tableType="expense"
          />
        </div>
      )}
      {(manage.intend === "closeBudget" ||
        manage.intend === "deleteBudget") && (
        <ConfirmModal
          message={manage.message}
          confirmAccent={manage.confirmAccent}
          confirmText={
            isSubmitting ? manage.inProgressText : manage.confirmText
          }
          proceed={submitHandler}
          cancel={() => {
            setManage((prev) => ({ ...prev, intend: "" }));
          }}
        />
      )}
      {manage.intend === "editBudget" && (
        <div className="absolute left-0 top-0 w-full h-full z-10 bg-[#0006]">
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/2 lg:w-1/3 p-5 rounded-md bg-white">
            <button
              className="absolute right-2 top-2 w-10 h-10 rounded-3xl grid place-content-center hover:bg-slate-200"
              onClick={() => {
                setManage((prev) => ({ ...prev, intend: "" }));
              }}
            >
              <FaXmark size={20} />
            </button>
            <AddForm
              prevName={budgetData.name}
              prevAmount={budgetData.amount}
              prevCategory={{
                name: budgetData.category,
                code: budgetData.category,
              }}
              categoryItems={budgetCategories}
              intend="editBudget"
            />
            <Button
              accent="slate"
              text="Cancel"
              customClasses="w-full my-2"
              onClick={() => {
                setManage((prev) => ({ ...prev, intend: "" }));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { loader, action };
export default BudgetPage;
