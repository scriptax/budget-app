import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function catchAsync (func: () => Promise<any>) {
  return func().catch((error) => {
    console.log("The error is: ", error)
    if (error instanceof AxiosError) {
      if (error.response) {
        // The server responded with a status code that is not 2xx
        return toast.error(error.response.data.message);
      } else {
        return toast.error("Something went very wrong!");
      }
    }
  });
}