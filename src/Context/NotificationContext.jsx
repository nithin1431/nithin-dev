import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

let id = 0;

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const newToast = {
      id: id++,
      message,
      type
    };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, 4000);
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}

      {/* TOAST UI */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded shadow-lg flex justify-between items-center min-w-[250px]
              ${toast.type === "success" && "bg-green-500 text-white"}
              ${toast.type === "error" && "bg-red-500 text-white"}
              ${toast.type === "warning" && "bg-yellow-400 text-black"}
              ${toast.type === "info" && "bg-blue-500 text-white"}
            `}
          >
            <span>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 font-bold"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

    </NotificationContext.Provider>
  ); 
};