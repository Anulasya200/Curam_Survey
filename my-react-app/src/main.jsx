import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import SurveyList from "./pages/SurveyList.jsx";
import SurveyForm from "./pages/SurveyForm.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/surveys" replace />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/new" element={<SurveyForm />} />
          <Route path="surveys/:id/edit" element={<SurveyForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
