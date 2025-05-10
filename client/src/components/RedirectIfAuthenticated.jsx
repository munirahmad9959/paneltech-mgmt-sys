import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const checkTokenValidity = (token) => {
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const RedirectIfAuthenticated = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);
  const isValid = checkTokenValidity(token);

  return isValid ? <Navigate to="/dashboard" replace /> : children;
};

export default RedirectIfAuthenticated;