import { BrowserRouter } from "react-router-dom";
import { Suspense, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "./toolkit/auth/authSlice";
import { getUserTheme } from "./toolkit/theme/themeSlice";
import { ConfigProvider, Spin, App as AntApp } from "antd";

import Router from "./routes/routes";
import { lightTheme, darkTheme } from "./themes";
import { HeaderComponent, NavbarComponent } from "./components";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.authentication);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.classList.add("bg-white", "dark:bg-black");
  }, []);

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getUserTheme());
    }
  }, [user, dispatch]);

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
            <Router user={user} loading={loading} />
          </BrowserRouter>
        </Suspense>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
