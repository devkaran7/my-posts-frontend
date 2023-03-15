import { createContext, useState } from "react";
import { setAuthToken } from "../utils/setAuthToken";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(undefined);
  const [userId, setUserId] = useState(undefined);

  const loginUser = (token, user) => {
    setUserToken(token);
    setAuthToken(token);
    setUserId(user);
    localStorage.setItem("user", user);
  };

  const logoutUser = (setIsLoading) => {
    setIsLoading(true);
    axios
      .get("https://pink-average-lamb.cyclic.app/api/v1/logout")
      .then((result) => {
        setUserToken(undefined);
        setAuthToken(undefined);
        setUserId(undefined);
        localStorage.removeItem("user");
        toast(result.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          type: "success",
        });
      })
      .catch((error) => {
        toast(error.response.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          type: "error",
        });
        console.log(error);
      });
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ userToken, loginUser, logoutUser, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
