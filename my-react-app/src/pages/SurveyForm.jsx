import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function SurveyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState({
    surveyName: "",
    createdBy: "",   // 👈 added
    questionsConfigured: []
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/survey/getById/${id}`)
        .then(res => {
          let questions = [];
          if (typeof res.data.questionsConfigured === "string") {
            try {
              questions = JSON.parse(res.data.questionsConfigured);
            } catch (e) {
              questions = [];
            }
          } else {
            questions = res.data.questionsConfigured || [];
          }

          setSurvey({
            ...res.data,
            questionsConfigured: questions
          });
        })
        .catch(err => console.error("Error fetching survey:", err));
    }
  }, [id]);

  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questionsConfigured];
    updatedQuestions[index][field] = value;
    setSurvey({ ...survey, questionsConfigured: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...survey.questionsConfigured];
    updatedQuestions[qIndex].options[optIndex] = value;
    setSurvey({ ...survey, questionsConfigured: updatedQuestions });
  };

  const addQuestion = () => {
    setSurvey({
      ...survey,
      questionsConfigured: [
        ...survey.questionsConfigured,
        { questionText: "", answerType: "text", options: [] }
      ]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...survey.questionsConfigured];
    updatedQuestions.splice(index, 1);
    setSurvey({ ...survey, questionsConfigured: updatedQuestions });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...survey.questionsConfigured];
    if (updatedQuestions[qIndex].options.length < 5) {
      updatedQuestions[qIndex].options.push("");
      setSurvey({ ...survey, questionsConfigured: updatedQuestions });
    } else {
      alert("Maximum 5 options allowed!");
    }
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...survey.questionsConfigured];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setSurvey({ ...survey, questionsConfigured: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...survey,
      questionsConfigured: JSON.stringify(survey.questionsConfigured) // backend expects string
    };

    // ❌ remove version from payload if present
    delete payload.version;

    try {
      if (id) {
        await axios.put("http://localhost:8080/survey/update", payload);
      } else {
        await axios.post("http://localhost:8080/survey/save", payload);
      }
      navigate("/surveys");
    } catch (err) {
      console.error("Error saving survey:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{id ? "Edit Survey" : "New Survey"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="surveyName"
          placeholder="Survey Name"
          value={survey.surveyName}
          onChange={handleSurveyChange}
        />

        <input
          name="createdBy"
          placeholder="Created By"
          value={survey.createdBy}
          onChange={handleSurveyChange}
        />

        <h3>Questions</h3>
        {survey.questionsConfigured.map((q, index) => (
          <div key={index} style={{ marginBottom: "15px", border: "1px solid #ccc", padding: "10px" }}>
            <input
              type="text"
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
            />

            <select
              value={q.answerType}
              onChange={(e) => handleQuestionChange(index, "answerType", e.target.value)}
            >
              <option value="text">Text Field</option>
              <option value="textarea">Text Area</option>
              <option value="radio">Radio Buttons</option>
              <option value="checkbox">Checkbox</option>
            </select>

            <button type="button" onClick={() => removeQuestion(index)}>Remove Question</button>

            {(q.answerType === "radio" || q.answerType === "checkbox") && (
              <div style={{ marginTop: "10px" }}>
                <h4>Options</h4>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                    />
                    <button type="button" onClick={() => removeOption(index, optIndex)}>Remove</button>
                  </div>
                ))}
                {q.options.length < 5 && (
                  <button type="button" onClick={() => addOption(index)}>+ Add Option</button>
                )}
              </div>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion}>+ Add Question</button>
        <br /><br />
        <button type="submit">Save Survey</button>
      </form>
    </div>
  );
}

export default SurveyForm;
