import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { AuthProviderProps } from "./contexts/auth";

import "./styles/global.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProviderProps>
      <App />
    </AuthProviderProps>
  </React.StrictMode>,
  document.getElementById("root")
);
