import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import LoginPage from "../pages/app/login/LoginPage";

function AuthorizedLayout({ user }) {
  return user ? <Outlet /> : <LoginPage />;
}

AuthorizedLayout.propTypes = {
  user: PropTypes.any,
};

export default AuthorizedLayout;
