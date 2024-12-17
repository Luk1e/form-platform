import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import HomePage from "../pages/app/home/HomePage";

function AdminLayout({ user }) {
  return user.isAdmin ? <Outlet /> : <HomePage />;
}

AdminLayout.propTypes = {
  user: PropTypes.any,
};

export default AdminLayout;
