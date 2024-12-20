import Router from "./routes/routes";
import { Suspense, useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "./toolkit/auth/authSlice";

import { ConfigProvider } from "antd";
import { HeaderComponent, NavbarComponent } from "./components";
import { lightTheme, darkTheme } from "./themes";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authentication);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.classList.add("bg-purple-1", "dark:bg-purple-4");
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
      <Suspense fallback={null}>
        <BrowserRouter>
          <HeaderComponent />
          <NavbarComponent />
          <Router user={user} />
        </BrowserRouter>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
