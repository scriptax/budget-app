import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { ActionFunctionArgs } from "react-router-dom";
import { ReactElement } from "react";

import { addIncome, deleteIncome, getIncomes } from "../utils/CRUDs";
import { IncomeData } from "../types/APIDATA";
import { incomeCategories } from "../data/defaultData";
import Table from "../components/Table";
import AddForm from "../components/Form";
import { PieChart } from "../components/Charts";
import catchAsync from "../utils/catchAsync";

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { intend, ...data } = requestData;

  if (intend === "newIncome") {
    return catchAsync(async () => {
      const res = await addIncome(data);
      if ((await res.status) === 201) {
        return toast.success("Income added!");
      }
    });
  }
  if (intend === "deleteIncome") {
    return catchAsync(async () => {
      const res = await deleteIncome(data.id);
      if ((await res.status) === 204) {
        return toast.success("Income deleted!");
      }
    });
  }
}

async function loader() {
  return catchAsync(async () => {
    const res = await getIncomes();
    if (res.status === 200) {
      return res.data.data.data;
    }
  });
}

function Incomes(): ReactElement {
  const incomeData = useLoaderData() as IncomeData[];

  const incomeSums: number[] = [];
  const incomeGroups: string[] = [];
  incomeData.forEach((incomeItem) => {
    let existingGroup = incomeGroups.find(
      (elem) => incomeItem.category === elem,
    );
    let existingGroupIndex: number = -1;
    if (existingGroup) {
      existingGroupIndex = incomeGroups.indexOf(existingGroup);
      incomeSums[existingGroupIndex] += incomeItem.amount;
    } else {
      incomeGroups.push(incomeItem.category);
      incomeSums.push(incomeItem.amount);
    }
  });

  return (
    <div className="w-full min-h-screen p-3 mx-auto relative">
      <div className="w-full flex flex-col sm:flex-row justify-around items-center sm:items-stretch">
        {incomeData.length > 0 && (
          <div className="w-full sm:w-1/2 lg:w-2/5 h-72 bg-white p-4 m-1 border border-stone-200 rounded-md">
            <PieChart
              title="Shares of each income source from total income"
              label="Share of incomes"
              data={incomeSums}
              labels={incomeGroups}
            />
          </div>
        )}
        <div className="w-full sm:w-1/2 lg:w-2/5 m-1 bg-white p-4 border border-stone-200 rounded-md">
          <AddForm intend="newIncome" categoryItems={incomeCategories} />
        </div>
      </div>
      {incomeData.length > 0 && (
        <div className="mt-6">
          <hr className="border-stone-300" />
          <h2 className="text-lg font-bold my-4">Last 30 day's incomes</h2>
          <p className="text-md font-bold my-4">
            Total Income:{" $"}
            {incomeData.reduce((total, value) => total + value.amount, 0)}
          </p>
          <Table
            categories={incomeCategories}
            showCategory={true}
            showDelete={true}
            tableData={incomeData}
            tableType="income"
          />
        </div>
      )}
    </div>
  );
}

export { action, loader };
export default Incomes;
