import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const checkTokenValidity = (token) => {
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    const isTokenValid = decodedToken.exp * 1000 > Date.now();
    return isTokenValid;
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth?.token);

  const isValid = checkTokenValidity(token);

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
