import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import HomePage from "../pages/app/home/HomePage";
import { Spin } from "antd";

function AdminLayout({ user, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return user?.isAdmin ? <Outlet /> : <HomePage />;
}

AdminLayout.propTypes = {
  user: PropTypes.any,
};

export default AdminLayout;
