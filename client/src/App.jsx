import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
// import { SessionProvider } from "./context/SessionContext";
import { SessionProvider } from "../Utils/SessionContext";
import SessionExpiredModal from "./components/SessionExpiredModal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  const isAuth = useSelector((state) => Boolean(state.auth.token));

  return (
    <SessionProvider> {/* Wrap entire app inside SessionProvider */}
      <BrowserRouter>
        {/* Session Expired Modal (Appears when token expires) */}
        <SessionExpiredModal />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Route (Only logged-in users can access) */}
          <Route element={<ProtectedRoute />}>    // did this just for testing purpose don't forget to uncomment this and remove the following code
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
};

export default App;
