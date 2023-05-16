import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/configStore";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    {/*redux store*/}
    <BrowserRouter>
      {/* react router dom */}
      <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
