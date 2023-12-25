import { ReactElement } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

import Button from "./Button";

type PropsType = {
  message: string;
  confirmAccent: string;
  confirmText: string;
  proceed: () => void;
  cancel: () => void;
};
function ConfirmModal({
  message,
  confirmAccent,
  confirmText,
  proceed,
  cancel,
}: PropsType): ReactElement {
  return (
    <div className="fixed left-0 top-0 w-full h-full z-10 bg-[#0006]">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10/12 md:w-1/2 lg:w-1/3 p-5 rounded-md bg-white text-center">
        <div className="mb-4">
          <FaTriangleExclamation
            size={30}
            className="text-slate-900 inline-block mx-2"
          />
          <p className="inline-block text-lg">{message}</p>
        </div>
        <Button
          accent="slate"
          text="Cancel"
          customClasses="w-2/5 mx-1"
          onClick={cancel}
        />
        <Button
          accent={confirmAccent}
          text={confirmText}
          customClasses="w-2/5 mx-1"
          onClick={proceed}
        />
      </div>
    </div>
  );
}

export default ConfirmModal;
