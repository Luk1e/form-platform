import { Spin } from "antd";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import LoginPage from "../pages/app/login/LoginPage";

AuthorizedLayout.propTypes = {
  user: PropTypes.any,
};

function AuthorizedLayout({ user, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return user ? <Outlet /> : <LoginPage />;
}

export default AuthorizedLayout;
