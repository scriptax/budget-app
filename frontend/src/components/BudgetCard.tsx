import { ReactElement } from "react";

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
  return (
    <div className="w-20 min-h-full text-center">
      <div
        className={`w-1/2 h-4/6 rounded-md relative mx-auto ${customClasses}`}
      >
        <div
          className="absolute left-0 bottom-0 w-full rounded-md bg-slate-800"
          style={{ height: `${(remaining * 100) / (spent + remaining)}%` }}
        ></div>
      </div>
      <div className="w-full text-xs text-center mt-2">
        {Math.round((remaining * 100) / (spent + remaining))}% Remaining
      </div>
    </div>
  );
};

type BudgetCardType = {
  name: string;
  category: string;
  amount: number;
  spent: number;
};
function BudgetCard({
  name,
  category,
  amount,
  spent,
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
      </div>
      <BudgetBar
        customClasses="bg-slate-300"
        spent={spent}
        remaining={amount - spent}
      />
    </div>
  );
}

export default BudgetCard;
