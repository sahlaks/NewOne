import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./Redux/Store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./Context/SocketContext";
import { NotificationProvider } from "./Context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SocketProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Provider store={store}>
            <App />
            <ToastContainer />
          </Provider>
        </BrowserRouter>
      </NotificationProvider>
    </SocketProvider>
  </React.StrictMode>
);
