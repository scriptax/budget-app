import { ReactElement } from "react";
import { IconType } from "react-icons/lib";
import { BiChevronRightCircle } from "react-icons/bi";

type SummaryCardPropsType = {
  customClasses?: string;
  title: string;
  text: string;
  Icon: IconType;
};
function SummaryCard({
  customClasses,
  title,
  text,
  Icon,
}: SummaryCardPropsType): ReactElement {
  return (
    <div
      className={`rounded-md p-3 text-white m-2 flex justify-between ${customClasses}`}
    >
      <div className="flex flex-col justify-between">
        <span className="font-bold block">{title}</span>
        <span className="block">{text}</span>
      </div>
      <div className="flex flex-col justify-between">
        <Icon size={25} />
        <BiChevronRightCircle className="cursor-pointer mt-2" size={25} />
      </div>
    </div>
  );
}

export default SummaryCard;
