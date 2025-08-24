// src/pages/Home.jsx
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SurveyTable from "../components/SurveyTable";
import { SurveyAPI } from "../api/client";

export default function Home() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await SurveyAPI.getAll();
      setSurveys(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message || e?.message || "Unable to fetch surveys"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q?.trim()) return surveys;
    const term = q.trim().toLowerCase();
    return surveys.filter(
      (s) =>
        String(s.surveyName || "").toLowerCase().includes(term) ||
        String(s.surveyId || "").toLowerCase().includes(term) ||
        String(s.status || "").toLowerCase().includes(term)
    );
  }, [q, surveys]);

  const handleAdd = () => navigate("/manage");

  const handleEdit = (s) => navigate(`/manage/${s.id ?? s.surveyId}`);

  const handleDelete = async (s) => {
    const id = s.id;
    if (id == null) {
      alert("Cannot delete: missing internal id");
      return;
    }
    const ok = confirm(
      `Delete this survey?\n\nName: ${s.surveyName}\nSurvey ID: ${s.surveyId}\nThis cannot be undone.`
    );
    if (!ok) return;
    try {
      await SurveyAPI.deleteById(id);
      await load();
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data || e?.message || "Failed to delete the survey."
      );
    }
  };

  const handleTake = (s) => navigate(`/take/${s.id ?? s.surveyId}`);
  const handleShowResponses = (s) => navigate(`/responses/${s.id ?? s.surveyId}`);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, survey id, or status…"
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <button onClick={load}>Search/Refresh</button>
      </div>

      <SurveyTable
        surveys={filtered}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTake={handleTake}
        onShowResponses={handleShowResponses}
        onRefresh={load}
      />
    </div>
  );
}