


import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-page">
      <Sidebar />

      <main className="min-h-screen lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
