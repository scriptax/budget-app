import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default async function catchAsync (func: () => Promise<any>) {
  try {
    return await func();
  } catch(error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // The server responded with a status code that is not 2xx
        toast.error(error.response.data.message);
        return null;
      } else {
        toast.error("Something went very wrong!");
        return null;
      }
    }
  }
}