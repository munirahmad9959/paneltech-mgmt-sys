// import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
// import RegisterPage from "./pages/RegisterPage"
// import { useSelector } from "react-redux";
// import LoginPage from "./pages/LoginPage";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";


// const App = () => {
//   const isAuth = Boolean(useSelector((state) => state.auth.token));
//   // const isLoggedIn = Boolean(useSelector((state) => state.auth.isLoggedIn));

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
//         {/* <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}
//         {/* <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}
//         {/* <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/" />} /> */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         {/* <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} />} /> */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;


import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  const isAuth = Boolean(useSelector((state) => state.auth.token));

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect authenticated users from "/" (Home) to "/dashboard" */}
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Home />} />

        {/* Redirect authenticated users from "/login" and "/register" to "/dashboard" */}
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protect "/dashboard" so only authenticated users can access it */}
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

