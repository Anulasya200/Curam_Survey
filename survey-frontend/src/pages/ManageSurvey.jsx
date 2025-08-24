import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { SurveyAPI } from "../api/client"; // uses both helper + raw axios instance

// ---------- helpers ----------
function deserializeQuestions(raw) {
  try {
    if (!raw) return [];
    if (Array.isArray(raw)) return normalizeQuestions(raw);
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? normalizeQuestions(parsed) : [];
    }
    return [];
  } catch {
    // fallback: line/CSV -> text questions
    if (typeof raw === "string") {
      return raw
        .split(/[\n,]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => ({ text: t, type: "text", options: [] }));
    }
    return [];
  }
}

function normalizeQuestions(arr) {
  return arr.map((q) => ({
    text: (q.text ?? q.questionText ?? "").trim(),
    type: q.type ?? q.questionType ?? "text",
    options: Array.isArray(q.options)
      ? q.options.map((o) => String(o).trim()).filter(Boolean)
      : [],
  }));
}

function serializeQuestions(questions) {
  // cleanup before sending
  const cleaned = (questions || []).map((q) => {
    const base = {
      text: (q.text || "").trim(),
      type: q.type || "text",
    };
    if (q.type === "single" || q.type === "multi") {
      return { ...base, options: (q.options || []).map((o) => String(o).trim()).filter(Boolean) };
    }
    return { ...base, options: [] };
  });
  return JSON.stringify(cleaned);
}

// ---------- component ----------
export default function ManageSurvey() {
  const navigate = useNavigate();
  const { id } = useParams(); // when set -> edit mode

  const [surveyName, setSurveyName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  // Load survey for edit
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await SurveyAPI.getById(id);
        if (cancelled) return;

        setSurveyName(data?.surveyName ?? "");
        setCreatedBy(data?.createdBy ?? data?.createdby ?? "");
       let raw = data?.questionsConfigured ?? data?.questions ?? "";
if (typeof raw === "string") {
  try {
    raw = JSON.parse(raw); // parse JSON string to array/object
  } catch {
    raw = []; // fallback if invalid JSON
  }
}
setQuestions(deserializeQuestions(raw));

      } catch (e) {
        console.error(e);
        alert("Could not load survey for editing.");
        navigate("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  // ----- question editors -----
  const addQuestion = () => {
    setQuestions((prev) => [...prev, { text: "", type: "text", options: [] }]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionField = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...(q.options || []), ""] } : q
      )
    );
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: (q.options || []).map((opt, j) =>
                j === optIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (qIndex, optIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: (q.options || []).filter((_, j) => j !== optIndex),
            }
          : q
      )
    );
  };

  // ----- submit -----
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!surveyName.trim()) {
      alert("Survey name is required");
      return;
    }
    if (!createdBy.trim()) {
      alert("Created By is required");
      return;
    }

    const questionsConfigured = serializeQuestions(questions);
    const payload = {
      surveyName,
      createdBy,
      questionsConfigured, // IMPORTANT: backend expects this key
    };

    try {
      setSaving(true);

      if (id) {
        // UPDATE FLOW (no backend change): send id in body to /survey/update
        await api.put("/survey/update", { id: Number(id), ...payload });
        alert("Survey updated (new version created).");
      } else {
        // CREATE FLOW
        await SurveyAPI.create(payload);
        alert("Survey created.");
      }

      // Go back to Home; Home will fetch and show the latest list
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to save survey";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!id;

  const canSubmit = useMemo(() => {
    if (!surveyName.trim() || !createdBy.trim()) return false;
    // at least zero questions is allowed; if you want, enforce >=1:
    // if ((questions || []).length === 0) return false;
    return true;
  }, [surveyName, createdBy, questions]);

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
        Loading survey…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>{isEdit ? "Edit Survey" : "Create Survey"}</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Survey Name</label>
          <input
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
            style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Created By</label>
          <input
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
          />
        </div>

        <h2 style={{ margin: "12px 0 4px" }}>Questions</h2>

        {(Array.isArray(questions) ? questions : []).map((q, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #e9e9e9",
              borderRadius: 10,
              padding: 12,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label>Question {idx + 1}</label>
              <input
                value={q.text}
                onChange={(e) => updateQuestionField(idx, "text", e.target.value)}
                style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                placeholder="Type your question…"
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label>Answer Type</label>
              <select
                value={q.type}
                onChange={(e) => updateQuestionField(idx, "type", e.target.value)}
                style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
              >
                <option value="text">Text Field</option>
                <option value="textarea">Text Area</option>
                <option value="single">Single Select</option>
                <option value="multi">Multi Select</option>
              </select>
            </div>

            {(q.type === "single" || q.type === "multi") && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Options</div>
                {(q.options || []).map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                      style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
                      placeholder={`Option ${optIdx + 1}`}
                    />
                    <button type="button" onClick={() => removeOption(idx, optIdx)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(idx)}>
                  + Add Option
                </button>
              </div>
            )}

            <div>
              <button type="button" onClick={() => removeQuestion(idx)} style={{ color: "#b00020" }}>
                Remove Question
              </button>
            </div>
          </div>
        ))}

        <div>
          <button type="button" onClick={addQuestion}>+ Add Question</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={!canSubmit || saving}>
            {saving ? "Saving…" : isEdit ? "Update Survey" : "Save Survey"}
          </button>
          <button type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
