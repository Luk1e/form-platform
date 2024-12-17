import { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/routes";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "./toolkit/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authentication);
  const { user } = authSlice;

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <Router user={user} />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
