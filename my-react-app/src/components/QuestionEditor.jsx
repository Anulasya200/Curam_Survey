import { useState, useEffect } from "react";

export default function QuestionEditor({ questions, onChange }) {
  const [localQuestions, setLocalQuestions] = useState([]);

  useEffect(() => {
    setLocalQuestions(questions || []);
  }, [questions]);

  const addQuestion = () => {
    const newQ = { text: "", type: "text", options: [] };
    const updated = [...localQuestions, newQ];
    setLocalQuestions(updated);
    onChange(updated);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...localQuestions];
    updated[index][field] = value;
    setLocalQuestions(updated);
    onChange(updated);
  };

  const removeQuestion = (index) => {
    const updated = localQuestions.filter((_, i) => i !== index);
    setLocalQuestions(updated);
    onChange(updated);
  };

  return (
    <div>
      <h3>Questions</h3>
      {localQuestions.map((q, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Question text"
            value={q.text}
            onChange={(e) => updateQuestion(i, "text", e.target.value)}
          />

          <select
            value={q.type}
            onChange={(e) => updateQuestion(i, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="single">Single Select</option>
            <option value="multi">Multi Select</option>
          </select>

          {(q.type === "single" || q.type === "multi") && (
            <input
              type="text"
              placeholder="Comma separated options"
              value={q.options?.join(",") || ""}
              onChange={(e) =>
                updateQuestion(i, "options", e.target.value.split(","))
              }
            />
          )}

          <button onClick={() => removeQuestion(i)}>Remove</button>
        </div>
      ))}

      <button onClick={addQuestion}>+ Add Question</button>
    </div>
  );
}
