import { ChangeEvent, ReactElement, useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";

import Input from "./Input";
import Button from "./Button";
import SearchList, { ListItemsType } from "./SearchList";
import { formContent } from "../data/defaultData";

type FormProps = {
  intend: "newBudget" | "editBudget" | "newExpense" | "newIncome";
  categoryItems: ListItemsType[];
  prevName?: string;
  prevAmount?: number;
  prevCategory?: ListItemsType;
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

  const content = formContent.find(
    (elem) => elem.intend === intend,
  )!;
  const [formData, setFormData] = useState({
    name: prevName || "",
    amount: prevAmount || 0,
    category: prevCategory || { name: "Select...", code: "" },
  });

  useEffect(() => {
    if (!isSubmitting) {
      setFormData({
        name: prevName || "",
        amount: prevAmount || 0,
        category: prevCategory || { name: "Select...", code: "" },
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
        <div className="w-full flex justify-between items-center">
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
            customClass="mt-3 w-6/12 float-right"
            items={categoryItems}
            listName={formData.category.name}
            itemPicker={listItemPicker}
          />
        </div>
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
