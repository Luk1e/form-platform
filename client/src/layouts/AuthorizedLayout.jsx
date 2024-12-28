import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import LoginPage from "../pages/app/login/LoginPage";
import { Spin } from "antd";

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

AuthorizedLayout.propTypes = {
  user: PropTypes.any,
};

export default AuthorizedLayout;
