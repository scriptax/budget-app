import { ReactElement } from "react";
import { IconType } from "react-icons/lib";

const colorAccents: object = {
  red: "bg-red-700",
  blue: "bg-blue-600",
  green: "bg-green-600",
  lime: "bg-lime-600",
  slate: "bg-slate-800",
};
type PropsType = {
  text: String;
  accent: String;
  customClasses?: String;
  onClick?: () => void;
  type?: "submit";
  disabled?: boolean;
  Icon?: IconType;
};
function Button({
  text,
  accent,
  customClasses,
  onClick,
  type,
  disabled,
  Icon,
}: PropsType): ReactElement {
  let accentKey = accent as keyof object;
  return (
    <button
      type={type || "button"}
      disabled={disabled}
      onClick={onClick}
      className={`border-0 outline-none px-4 py-2 ${colorAccents[accentKey]} ${customClasses} text-white rounded-md cursor-pointer active:scale-95 transition-transform duration-100 text-md hover:opacity-95`}
    >
      <span className="mr-2 text-white">{text}</span>
      {Icon && <span className="inline-block m-auto">{<Icon />}</span>}
    </button>
  );
}

export default Button;
