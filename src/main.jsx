import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PyodideProvider } from "./pyodide/PyodideProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PyodideProvider>
      <App />
    </PyodideProvider>
    
  </React.StrictMode>
);