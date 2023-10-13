import { ReactElement, useEffect, useState } from "react";
import { FaChartColumn, FaChartPie } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

import SearchList, { ListItemsType } from "../components/SearchList";
import Button from "../components/Button";
import { budgetCategories, incomeCategories, years, months } from "../data/defaultData";
import { getStats } from "../utils/statsRequests";
import { BarChart, PieChart } from "../components/Charts";

async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (!url.search) return null;
  try {
    const res = await getStats(request.url);
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

async function action({ request }: ActionFunctionArgs) {
  const requestData = await request.json();
  const { reptype, year, month, category } = requestData;
  return redirect(
    `/dashboard/stats?reptype=${reptype.code}&year=${year.code}&month=${month.code}&category=${category.code}`,
  );
}

const charts = [
  { name: "Expense breakdown", code: "expense-breakdown" },
  { name: "Income breakdown", code: "income-breakdown" },
  { name: "Expense report", code: "expense-report" },
  { name: "Income report", code: "income-report" },
  { name: "Saving report", code: "saving-report" },
];

// const NoData = (): ReactElement => {
//   return (
//     <div className="w-full text-xl text-center text-slate-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
//       <FaChartColumn className="inline-block mx-2" size={70} />
//       <p className="block mt-10">No data!</p>
//     </div>
//   );
// };

function Stats(): ReactElement {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isSubmitting = fetcher.state === "submitting";
  const stats = useLoaderData() as object[] | null;

  const [showRep, setShowRep] = useState<boolean>(false);
  const [statOptions, setStatOptions] = useState({
    reptype: { name: "Select a report", code: "" },
    year: { name: "Select a year", code: "" },
    month: { name: "Select a month", code: "" },
    category: { name: "Select a category", code: "" },
  });
  const listItemPicker = (item: ListItemsType, name: string) => {
    setStatOptions((prev) => {
      return { ...prev, [name]: item };
    });
  };
  const submitHandler = (): void => {
    const actionData = statOptions;
    fetcher.submit(actionData, {
      method: "post",
      encType: "application/json",
    });
  };

  useEffect(() => {
    setStatOptions((prev) => ({
      ...prev,
      year: { name: "Select a year", code: "" },
      month: { name: "Select a month", code: "" },
      category: { name: "Select a category", code: "" },
    }));
    setShowRep(false);
  }, [statOptions.reptype.name]);

  useEffect(() => {
    if (stats && !isLoading) {
      setShowRep(true);
    }
  }, [stats, isLoading]);

  return (
    <div className="w-full min-h-screen p-5 mx-auto relative">
      <div className="flex justify-center items-center flex-col sm:flex-row">
        <SearchList
          title="Report type"
          name="reptype"
          items={charts}
          listName={statOptions.reptype.name}
          itemPicker={listItemPicker}
          customClass="w-full sm:w-1/4 sm:mx-3 mt-2"
        />
        {statOptions.reptype.code && (
          <SearchList
            title="Year"
            name="year"
            items={years}
            listName={statOptions.year.name}
            itemPicker={listItemPicker}
            customClass="w-full sm:w-1/4 sm:mx-3 mt-2"
          />
        )}
        {statOptions.reptype.code.includes("breakdown") && (
          <SearchList
            title="Month"
            name="month"
            items={[{ name: "All", code: "" }, ...months]}
            listName={statOptions.month.name}
            itemPicker={listItemPicker}
            customClass="w-full sm:w-1/4 sm:mx-3 mt-2"
          />
        )}
        {statOptions.reptype.code.includes("report") &&
          !statOptions.reptype.code.includes("saving") && (
            <SearchList
              title="Category"
              name="category"
              items={
                statOptions.reptype.code.includes("expense")
                  ? [{ name: "All", code: "" }, ...budgetCategories]
                  : [{ name: "All", code: "" }, ...incomeCategories]
              }
              listName={statOptions.category.name}
              itemPicker={listItemPicker}
              customClass="w-full sm:w-1/4 sm:mx-3 mt-2"
            />
          )}
      </div>
      {statOptions.reptype.code && (
        <Button
          customClasses="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 my-5 mx-auto block"
          text={isSubmitting ? "Getting data..." : "Get report"}
          accent="slate"
          onClick={submitHandler}
        />
      )}
      {!statOptions.reptype.code && (
        <div className="w-full text-xl text-center text-slate-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <FaChartColumn className="inline-block mx-2" size={70} />
          <FaChartPie className="inline-block mx-2" size={70} />
          <BiSolidReport className="inline-block mx-2" size={70} />
          <br />
          <p className="block mt-10">Select a report to get started...</p>
        </div>
      )}
      {showRep && (
        <div className="w-full flex flex-col sm:flex-row justify-around items-center sm:items-stretch">
          {/* <div className="w-full sm:w-1/2 lg:w-2/5 m-1 bg-white p-4 border border-stone-200 rounded-md">
          report
        </div> */}
          <div className="w-full sm:w-1/2 lg:w-2/5 h-72 m-1 bg-white p-4 border border-stone-200 rounded-md relative">
            {statOptions.reptype.code === "income-breakdown" &&
              statOptions.year.code !== "" && (
                <PieChart
                  title="Shares of each income source from total income"
                  data={stats!.map((elem) =>
                    "percentage" in elem ? (elem.percentage as number) : 0,
                  )}
                  labels={stats!.map((elem) =>
                    "category" in elem ? (elem.category as string) : "",
                  )}
                  label="Share of incomes (%)"
                />
              )}
            {statOptions.reptype.code === "expense-breakdown" &&
              statOptions.year.code !== "" && (
                <PieChart
                  title="Shares of each expense category from total expense"
                  data={stats!.map((elem) =>
                    "percentage" in elem ? (elem.percentage as number) : 0,
                  )}
                  labels={stats!.map((elem) =>
                    "category" in elem ? (elem.category as string) : "",
                  )}
                  label="Share of expenses (%)"
                />
              )}
            {statOptions.reptype.code === "expense-report" &&
              statOptions.year.code !== "" && (
                <BarChart
                  title={`Expenses of ${!statOptions.category.code
                    ? "all categories"
                    : statOptions.category.name + " category"
                    } in ${statOptions.year.name}`}
                  labels={months.map((elem) => elem.name)}
                  label="Expense amount ($)"
                  data={
                    stats!.length > 0
                      ? months.map((elem, index) => {
                        let match = stats!.find(
                          (elem) => (elem as any).month === index + 1,
                        );
                        if (match) {
                          return (match as any).total;
                        } else return 0;
                      })
                      : new Array(12).fill(0)
                  }
                />
              )}
            {statOptions.reptype.code === "income-report" &&
              statOptions.year.code !== "" && (
                <BarChart
                  title={`Incomes from ${!statOptions.category.code
                    ? "all categories"
                    : statOptions.category.name + " category"
                    } in ${statOptions.year.name}`}
                  labels={months.map((elem) => elem.name)}
                  label="Income amount ($)"
                  data={
                    stats!.length > 0
                      ? months.map((elem, index) => {
                        let match = stats!.find(
                          (elem) => (elem as any).month === index + 1,
                        );
                        if (match) {
                          return (match as any).total;
                        } else return 0;
                      })
                      : new Array(12).fill(0)
                  }
                />
              )}
            {statOptions.reptype.code === "saving-report" &&
              statOptions.year.code !== "" && (
                <BarChart
                  title={`Saving amount in ${statOptions.year.name}`}
                  labels={months.map((elem) => elem.name)}
                  label="Saving amount ($)"
                  data={
                    stats!.length > 0
                      ? months.map((elem, index) => {
                        let match = stats!.find(
                          (elem) => (elem as any).month === index + 1,
                        );
                        if (match) {
                          return (match as any).saving;
                        } else return 0;
                      })
                      : new Array(12).fill(0)
                  }
                />
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export { loader, action };
export default Stats;
