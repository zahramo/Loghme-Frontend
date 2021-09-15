import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const toastList = new Set();
  const MAX_TOAST = 3;
  function notify(msg) {
    let toastIdToDismiss = null;
    if (toastList.size === MAX_TOAST) {
      const arr = Array.from(toastList);
      const toastId = arr[0];
      if (toastId) {
        toastIdToDismiss = toastId;
      }
    }
     const id = 
     toast(msg ,{
      onClose: () => toastList.delete(id),
      onOpen: () => {
        if (toastIdToDismiss !== null) {
          
          setTimeout(() => {
            toast.dismiss(toastIdToDismiss);
          }, 1000);
        }
      }
    }
    );
    toastList.add(id);
  }

  export default notify;