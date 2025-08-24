// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ManageSurvey from "./pages/ManageSurvey";
import TakeSurvey from "./pages/TakeSurvey";
import ShowResponses from "./pages/ShowResponses";

// Temporary placeholders so navigation works now
function Placeholder({ title }) {
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p>We will implement this page in the next step.</p>
      <a href="/">← Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        
        <Route path="/manage" element={<ManageSurvey />} />   {/* <-- Fixed */}
        <Route path="/manage/:id" element={<ManageSurvey />} /> {/* For editing */}
        <Route path="/manage/:id" element={<Placeholder title="Edit Survey" />} />
        
        

        {/* Take a survey (respondent view) */}
        <Route path="/take-survey/:id" element={<TakeSurvey />} />
        <Route path="/responses/:id" element={<ShowResponses />} />
      </Routes>
    </BrowserRouter>
  );
}