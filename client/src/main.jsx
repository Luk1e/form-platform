import "./main.scss";
import "./i18next.js";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import store from "./store/store";
import { Provider } from "react-redux";
import { injectStore } from "./utils/hooks/useAxios";

injectStore(store);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
