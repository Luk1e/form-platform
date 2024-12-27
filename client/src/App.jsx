import Router from "./routes/routes";
import { Suspense, useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "./toolkit/auth/authSlice";

import { ConfigProvider, Spin, App as AntApp } from "antd";
import { HeaderComponent, NavbarComponent } from "./components";
import { lightTheme, darkTheme } from "./themes";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authentication);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.classList.add("bg-white", "dark:bg-black");
  }, []);

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  const currentTheme = useMemo(
    () => (themeMode === "light" ? lightTheme : darkTheme),
    [themeMode]
  );

  return (
    <ConfigProvider theme={currentTheme}>
      <GoogleOAuthProvider clientId="530002033942-0dmk751ql0c82dii5sdffpp3np4muejh.apps.googleusercontent.com">
        <AntApp>
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
              </div>
            }
          >
            <BrowserRouter>
              <HeaderComponent />
              <NavbarComponent />
              <Router user={user} />
            </BrowserRouter>
          </Suspense>
        </AntApp>
      </GoogleOAuthProvider>
    </ConfigProvider>
  );
}

export default App;
