import React from "react";
import { useNavigate } from "react-router-dom";

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
}

export default function SurveyTable({
  surveys,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onShowResponses,
  onRefresh,
}) {
  const navigate = useNavigate();

  // Always navigate using `id` (not surveyId) for take-survey
  const handleTake = (survey) => {
    navigate(`/take-survey/${survey.id}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Surveys</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onRefresh} title="Refresh">
            Refresh
          </button>
          <button
            onClick={onAdd}
            style={{ fontWeight: 600 }}
            title="Create a new survey"
          >
            + Add Survey
          </button>
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <div>Loading surveys…</div>}
      {error && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>
          {typeof error === "string" ? error : "Failed to load surveys."}
        </div>
      )}

      {/* Empty State */}
      {!loading && (!surveys || surveys.length === 0) && (
        <div
          style={{
            padding: 16,
            border: "1px dashed #ccc",
            borderRadius: 8,
          }}
        >
          No surveys yet. Click <strong>+ Add Survey</strong> to create one.
        </div>
      )}

      {/* Table */}
      {!loading && surveys && surveys.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thCenter}>#</th>
                <th style={thCenter}>Survey ID</th>
                <th style={th}>Name</th>
                <th style={th}>Created By</th>
                <th style={thCenter}>Status</th>
                <th style={thCenter}>Created</th>
                <th style={thCenter}>Modified</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((s, idx) => (
                <tr key={`${s.id}-${idx}`}>
                  <td style={tdCenter}>{idx + 1}</td>
                  <td style={tdCenter}>{s.surveyId ?? s.id ?? "—"}</td>
                  <td style={td}>{s.surveyName ?? s.title ?? s.name ?? "—"}</td>
                  <td style={td}>{s.createdBy ?? "—"}</td>
                  <td style={tdCenter}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        background:
                          s.status === "Final"
                            ? "#e6f4ea"
                            : s.status === "Over Ridden"
                            ? "#fff3e0"
                            : "#eceff1",
                        border: "1px solid #ddd",
                      }}
                    >
                      {s.status ?? "—"}
                    </span>
                  </td>
                  <td style={tdCenter}>{formatDate(s.createdDate)}</td>
                  <td style={tdCenter}>{formatDate(s.modifiedDate)}</td>
                  <td style={{ ...td, minWidth: 360 }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <button onClick={() => onEdit(s)}>Edit</button>
                      <button
                        onClick={() => onDelete(s)}
                        title="Delete survey"
                        style={{ borderColor: "#ffb4ab", color: "#b00020" }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleTake(s)}
                        title={
                          s.status === "Over Ridden"
                            ? "Cannot take this survey"
                            : "Take this survey"
                        }
                        disabled={s.status === "Over Ridden"}
                        style={{
                          opacity: s.status === "Over Ridden" ? 0.5 : 1,
                          cursor:
                            s.status === "Over Ridden"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Take Survey
                      </button>
                      <button
                        onClick={() => onShowResponses(s)}
                        title="View responses for this survey"
                      >
                        Show Responses
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  borderBottom: "1px solid #e0e0e0",
  padding: "10px 8px",
  fontSize: 14,
  color: "#555",
  background: "#fafafa",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const thCenter = { ...th, textAlign: "center" };

const td = {
  borderBottom: "1px solid #f0f0f0",
  padding: "10px 8px",
  fontSize: 14,
};

const tdCenter = { ...td, textAlign: "center" };
