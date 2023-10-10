import { ReactElement } from "react";

type PropsType = {
  name: string;
  type: string;
  value: string | number;
  placeholder: string;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customClass?: string;
  required?: boolean;
};
function Input({
  name,
  type,
  value,
  changeHandler,
  placeholder,
  customClass,
  required,
}: PropsType): ReactElement {
  return (
    <div className={`${customClass}`}>
      <span className="text-sm block w-full truncate">{placeholder}</span>
      <input
        className={`py-2 text-md bg-slate-100 rounded-md px-3 border-0 outline-slate-600 w-full`}
        name={name}
        type={type}
        value={value}
        onChange={changeHandler}
        required={required || true}
      />
    </div>
  );
}
export default Input;
