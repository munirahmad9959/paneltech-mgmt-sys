import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import setloading from "../state/index";
import UserDashboardSidebar from "../components/UserDashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboardSidebar from "../components/AdminDashboardSidebar";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState("Records");
  const [showSidebar, setShowSidebar] = useState(false);
  const [navDropDown, setNavDropDown] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const renderAdminView = () => {
    switch (currentView) {
      case "Records":
        return <AdminDashboard setShowSidebar={setShowSidebar} setNavDropDown={setNavDropDown}/>;
      case "Add Quizzes":
        return <AddQuizForm setShowSidebar={setShowSidebar} setNavDropDown={setNavDropDown}/>;
      default:
        return <div>Invalid View</div>;
    }
  };

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        {user.role === "admin" ? (
          <AdminDashboardSidebar setCurrentView={setCurrentView} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        ) : user.role === "user" ? (
          <UserDashboardSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        ) : null}

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col bg-gray-100 md:ml-64 w-full"
          onClick={toggleDropdown}
        >
          {/* Navbar */}
          <DashboardNavbar setShowSidebar={setShowSidebar} navDropDown={navDropDown} setNavDropDown={setNavDropDown}/>

          {/* Main Content Body */}
          <main className="flex-1 p-1 md:p-6 w-full">
            {user.role === "user" ? (
              <UserDashboard setShowSidebar={setShowSidebar} setNavDropDown={setNavDropDown}/>
            ) : user.role === "admin" ? (
              renderAdminView()
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
