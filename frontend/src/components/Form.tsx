import { ChangeEvent, ReactElement, useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { FaMoneyCheckDollar, FaMoneyBill1 } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { IconType } from "react-icons/lib";

import Input from "./Input";
import Button from "./Button";
import SearchList, { ListItemsType } from "./SearchList";

type FormContentType = {
  intend: string;
  title: string;
  TitleIcon: IconType;
  nameHint: string;
  categoryName: string;
  confirmText: string;
  inProgressText: string;
};

const formContent: FormContentType[] = [
  {
    intend: "newBudget",
    title: "Create Budget",
    TitleIcon: FaMoneyCheckDollar,
    nameHint: "E.g. November groceries",
    categoryName: "Budget category",
    confirmText: "Create",
    inProgressText: "Creating...",
  },
  {
    intend: "editBudget",
    title: "Edit Budget",
    TitleIcon: FaMoneyCheckDollar,
    nameHint: "E.g. November groceries",
    categoryName: "Budget category",
    confirmText: "Edit",
    inProgressText: "Editing...",
  },
  {
    intend: "newExpense",
    title: "Add Expense",
    TitleIcon: GiPayMoney,
    nameHint: "E.g. vegetables",
    categoryName: "Budget",
    confirmText: "Add",
    inProgressText: "Adding...",
  },
  {
    intend: "newIncome",
    title: "Add Income",
    TitleIcon: FaMoneyBill1,
    nameHint: "E.g. April salary",
    categoryName: "Income category",
    confirmText: "Add",
    inProgressText: "Adding...",
  },
];

type FormProps = {
  intend: "newBudget" | "editBudget" | "newExpense" | "newIncome";
  categoryItems: { code: string; name: string }[];
  prevName?: string;
  prevAmount?: number;
  prevCategory?: { code: string; name: string };
};
function AddForm({
  intend,
  categoryItems,
  prevName,
  prevAmount,
  prevCategory,
}: FormProps): ReactElement {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const content: FormContentType = formContent.find(
    (elem) => elem.intend === intend,
  )!;
  const [formData, setFormData] = useState({
    name: prevName || "",
    amount: prevAmount || 0,
    category: prevCategory || { name: "Category", code: "" },
  });

  useEffect(() => {
    if (!isSubmitting) {
      setFormData({
        name: prevName || "",
        amount: prevAmount || 0,
        category: prevCategory || { name: "Category", code: "" },
      });
    }
  }, [isSubmitting]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const listItemPicker = (item: ListItemsType, name: string) => {
    setFormData((prev) => {
      return { ...prev, [name]: item };
    });
  };
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();

    const actionData = { ...formData, intend };
    fetcher.submit(actionData, {
      method: "post",
      // action: "/auth/signup",
      encType: "application/json",
    });
  };
  return (
    <div className="w-full">
      <h2 className="text-slate-800">
        <content.TitleIcon className="inline-block" size={30} />
        <span className="font-bold text-lg ml-2">{content.title}</span>
      </h2>
      <form onSubmit={submitHandler}>
        <Input
          name="name"
          placeholder={`Name (${content.nameHint})`}
          type="text"
          value={formData.name}
          changeHandler={changeHandler}
          customClass="w-full my-3"
        />
        <Input
          name="amount"
          placeholder="Amount (e.g. 250)"
          type="number"
          value={formData.amount}
          changeHandler={changeHandler}
          customClass="w-5/12 mt-3 float-left"
        />
        <SearchList
          title={content.categoryName}
          name="category"
          customClass="my-3 w-6/12 float-right"
          items={categoryItems}
          listName={formData.category.name}
          itemPicker={listItemPicker}
        />
        <Button
          accent="blue"
          text={isSubmitting ? content.inProgressText : content.confirmText}
          type="submit"
          customClasses="w-full mt-5"
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}

export default AddForm;
