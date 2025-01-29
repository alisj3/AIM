import { createContext, useContext } from "react";
import { toast } from "react-toastify";

// Create a Notification Context
const NotificationContext = createContext();

// Custom Hook
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const showNotification = (message, type = "default", icon = null) => {
    toast(
      <div className="toast-content">
        {icon && <img src={icon} alt="icon" className="toast-icon" />}
        <span>{message}</span>
      </div>,
      {
        type,
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: "toast-progress",
      }
    );
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
