import { createContext, useState, useEffect, useMemo } from "react"; import { useNotification } from "./NotificationContext";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { addToast } = useNotification();

  const [theme, setTheme] = useState("light"); const [role, setRole] = useState(localStorage.getItem("role") || "user"); const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("auth") === "true"); const [cards, setCards] = useState([]);

  const toggleTheme = () => { setTheme(prev => (prev === "light" ? "dark" : "light")); };

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  useEffect(() => { localStorage.setItem("role", role); }, [role]);

  const login = (email, password) => {
    const users = { "admin@gmail.com": "admin", "user@gmail.com": "user" };

    if (users[email] && password === "1234") {
      const userRole = users[email];
      setRole(userRole);
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      localStorage.setItem("role", userRole);
      addToast(`${userRole} logged in successfully`, "success");
      return true;
    }

    addToast("Invalid credentials", "error");
    return false;

  };

  const logout = () => { setIsAuthenticated(false); localStorage.removeItem("auth"); addToast("Logged out successfully", "info"); };

  const value = useMemo(() => ({ theme, toggleTheme, role, setRole, cards, setCards, isAuthenticated, login, logout }), [theme, role, cards, isAuthenticated]);

  return (<AppContext.Provider value={value}> {children} </AppContext.Provider>);
};
