import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorPage from "../pages/app/error/ErrorPage";
import { Spin } from "antd";

function AdminLayout({ user, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return user?.isAdmin ? <Outlet /> : <ErrorPage />;
}

AdminLayout.propTypes = {
  user: PropTypes.any,
};

export default AdminLayout;
