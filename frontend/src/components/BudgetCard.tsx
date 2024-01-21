import { ReactElement } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

type BudgetBarType = {
  customClasses?: string;
  spent: number;
  remaining: number;
};
const BudgetBar = ({
  customClasses,
  spent,
  remaining,
}: BudgetBarType): ReactElement => {
  const moneyExists = remaining >= 0;
  return (
    <div className="w-20 min-h-full text-center">
      <div
        className={`w-1/2 h-4/6 max-h-4/6 rounded-md relative mx-auto overflow-hidden ${customClasses}`}
      >
        {moneyExists ? (
          <div
            className="absolute left-0 bottom-0 w-full bg-slate-800"
            style={{ height: `${(remaining * 100) / (spent + remaining)}%` }}
          ></div>
        ) : (
          <FaTriangleExclamation
            size={20}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>
      <div
        className={`w-full text-xs text-center mt-2 ${
          !moneyExists && "text-red-700"
        }`}
      >
        {moneyExists
          ? `${Math.round((remaining * 100) / (spent + remaining))} % Remaining`
          : `$${remaining * -1} Overbudget`}
      </div>
    </div>
  );
};

type BudgetCardType = {
  name: string;
  category: string;
  amount: number;
  spent: number;
  setAt?: string;
};
function BudgetCard({
  name,
  category,
  amount,
  spent,
  setAt,
}: BudgetCardType): ReactElement {
  return (
    <div className="p-3 flex w-full">
      <div className="w-4/5 text-slate-800 text-sm">
        <div className="text-lg mb-2 font-bold my-1 truncate">{name}</div>
        <div className="font-normal my-1">
          <span className="font-bold">Category: </span>
          {category}
        </div>
        <div className="my-1">
          <span className="font-bold">Total Budget: </span>${amount}
        </div>
        <div className="my-1">
          <span className="font-bold">Spent: </span>${spent}
        </div>
        {setAt && (
          <div className="my-1">
            <span className="font-bold">Date created: </span>
            {new Date(setAt).toLocaleDateString()}
          </div>
        )}
      </div>
      <BudgetBar
        customClasses={spent < amount ? "bg-slate-300" : "bg-red-200"}
        spent={spent}
        remaining={amount - spent}
      />
    </div>
  );
}

export default BudgetCard;
