import axios from "axios";

const API_BASE = "http://localhost:8080/survey";

// Survey APIs
export const getSurveys = () => axios.get(`${API_BASE}/getAll`);
export const getSurveyById = (id) => axios.get(`${API_BASE}/getById/${id}`);
export const createSurvey = (survey) => axios.post(`${API_BASE}/save`, survey);
export const updateSurvey = (survey) => axios.put(`${API_BASE}/update`, survey);
export const deleteSurvey = (id) => axios.delete(`${API_BASE}/deleteSurvey/${id}`);
