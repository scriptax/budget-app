import { ReactElement } from "react";

type PropsType = {
  text: String;
  customClasses: String;
};

function Button({ text, customClasses }: PropsType): ReactElement {
  return(
    <button className={`border-0 outline-none px-4 py-3 ${customClasses} text-white rounded-lg cursor-pointer active:scale-95 transition-transform duration-100 text-md`}>
      { text }
    </button>
  )
}

export default Button;