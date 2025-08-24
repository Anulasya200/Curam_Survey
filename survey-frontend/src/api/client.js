import axios from "axios";

// Base URL - Uses .env if available, otherwise falls back to localhost:8080
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- Survey endpoints ----
export const SurveyAPI = {
  getAll: () => api.get("/survey/getAll").then(r => r.data),
  getById: (id) => api.get(`/survey/getById/${id}`).then(r => r.data),
  deleteById: (id) => api.delete(`/survey/deleteSurvey/${id}`).then(r => r.data),
  create: (data) => api.post("/survey/save", data).then(r => r.data),
  update: (id, data) => api.put(`/survey/update/${id}`, data).then(r => r.data),
};

// ---- Result endpoints ----
export const ResultAPI = {
  getAll: () => api.get("/result/allResult").then(r => r.data),

  // Save survey responses
  save: (data) => api.post("/result/save", data).then(r => r.data),

  // Get responses by survey ID (same as survey.id)
  getBySurveyId: (surveyId) =>
    api.get(`/result/getBySurveyId`, { params: { surveyId } })
       .then(r => r.data),

  // Optional: Get responses by keyword
  getByKeyword: (keyword) =>
    api.get(`/result/getByKeyword`, { params: { keyword } })
       .then(r => r.data),
};

export default api;
