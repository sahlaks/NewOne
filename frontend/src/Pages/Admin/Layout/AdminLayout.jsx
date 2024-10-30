// AdminLayout.js
import React from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";
import AdminHeader from "../../../Components/Header/AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <div className=" fixed">       
            <AdminSidebar />
        </div>


        <div className="flex flex-col w-full ml-20">
          <main className="flex-1 p-20">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
