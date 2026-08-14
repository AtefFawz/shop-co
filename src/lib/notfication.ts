// import { useNotification } from "@/store/notificationStore";
import toast from "react-hot-toast";

export const notification = (status: string) => {
  //   const { stack } = useNotification();
  toast.success("Status Order" + status);
  console.log(status);
};
