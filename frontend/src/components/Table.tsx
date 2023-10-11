import { ReactElement } from "react";
import { Link, useFetcher } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";

import { ExpenseData, IncomeData } from "../types/APIDATA";

type TableBodyRowProps = {
  data: ExpenseData | IncomeData;
  showCategory: boolean;
  showDelete: boolean;
  tableType: "expense" | "income";
  category: { name: string; code: string };
};
const TableBodyRow = ({
  category,
  data,
  showCategory,
  showDelete,
  tableType,
}: TableBodyRowProps): ReactElement => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const rowData = [
    data.name,
    `$${data.amount}`,
    new Date(data.setAt).toLocaleDateString(),
  ];
  const filteredRowData = rowData.filter((elem) => elem !== undefined);

  const deleteHandler = (id: string, intend: string) => {
    const actionData = { id, intend };
    fetcher.submit(actionData, {
      method: "post",
      // action: "/auth/signup",
      encType: "application/json",
    });
  };
  return (
    <>
      {filteredRowData.map((elem, index) => (
        <td className="text-xs sm:text-sm py-2" key={index}>
          {elem}
        </td>
      ))}
      {showCategory && (
        <td className="text-xs sm:text-sm">
          {tableType === "expense" ? (
            <button className="hover:text-red-700 group">
              <Link to={`/dashboard/home/budget/${category.code}`}>
                {category.name}
              </Link>
            </button>
          ) : (
            category.name
          )}
        </td>
      )}
      {showDelete && (
        <td className="text-xs sm:text-sm">
          <button
            title="Delete item"
            className="hover:text-red-700 group"
            onClick={() => {
              deleteHandler(
                data._id,
                tableType === "expense" ? "deleteExpense" : "deleteIncome",
              );
            }}
          >
            <FaRegTrashCan className="inline-block" size={15} />
            <span className="text-sm">
              {" "}
              {isSubmitting ? "..." : ""}
            </span>
          </button>
        </td>
      )}
    </>
  );
};

type PropsType = {
  showCategory: boolean;
  showDelete: boolean;
  tableData: ExpenseData[] | IncomeData[];
  tableType: "expense" | "income";
  categories: { name: string; code: string }[];
};
function Table({
  showCategory,
  showDelete,
  tableData,
  tableType,
  categories,
}: PropsType): ReactElement {
  return (
    <div className="w-full">
      <table className="w-full border-slate-600">
        <thead className="bg-slate-800 text-white text-xs sm:text-sm border-collapse table-auto">
          <tr>
            {[
              "Name",
              "Amount",
              "Date",
              showCategory
                ? tableType === "expense"
                  ? "Budget"
                  : "Category"
                : "",
              showDelete ? "" : null,
            ].map((head, index) => (
              <th className="py-2" key={index}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index, arr) => {
            let rowData = arr[arr.length - index - 1];
            let category = categories.find((item) =>
              tableType === "expense"
                ? "budget" in rowData && (rowData as ExpenseData).budget === item.code
                : "category" in rowData && (rowData as IncomeData).category === item.name,
            );
            return (
              <tr className="text-center odd:bg-slate-200 hover:bg-orange-100 ">
                <TableBodyRow
                  tableType={tableType}
                  key={index}
                  category={category!}
                  data={rowData}
                  showCategory={showCategory}
                  showDelete={showDelete}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
