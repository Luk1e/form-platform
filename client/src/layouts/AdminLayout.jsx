import { Spin } from "antd";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import ErrorPage from "../pages/app/error/ErrorPage";

AdminLayout.propTypes = {
  user: PropTypes.any,
};

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

export default AdminLayout;
