import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSurveys, deleteSurvey } from "../api";

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  const loadSurveys = async () => {
    try {
      const res = await getSurveys();
      setSurveys(res.data);
    } catch (err) {
      console.error("Error fetching surveys:", err);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSurvey(id);
      loadSurveys();
    } catch (err) {
      console.error("Error deleting survey:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Survey List</h1>
      <button onClick={() => navigate("/surveys/new")}>+ Add Survey</button>
      <ul>
        {surveys.map((s) => (
          <li key={s.id}>
            <b>{s.surveyName}</b> (Version {s.version})
            <button onClick={() => navigate(`/surveys/${s.id}/edit`)}>Edit</button>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
