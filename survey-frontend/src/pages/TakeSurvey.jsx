import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SurveyAPI, ResultAPI } from "../api/client";

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    SurveyAPI.getById(id)
      .then((data) => {
        console.log("Survey API response:", data);

        let parsedQuestions = [];
        try {
          const raw = data.questionsConfigured || data.questions_configured;
          if (raw) {
            const firstParse = typeof raw === "string" ? JSON.parse(raw) : raw;
            parsedQuestions =
              typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
          }
        } catch (err) {
          console.error("Failed to parse questions:", err);
        }

        setSurvey({
          ...data,
          questions: Array.isArray(parsedQuestions) ? parsedQuestions : [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching survey:", err);
        setError("Failed to load survey");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (index, value) => {
    setResponses((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleMultiSelectChange = (index, option) => {
    setResponses((prev) => {
      const current = prev[index] || [];
      if (current.includes(option)) {
        return {
          ...prev,
          [index]: current.filter((o) => o !== option),
        };
      }
      return {
        ...prev,
        [index]: [...current, option],
      };
    });
  };

  const handleSubmit = async () => {
    if (!survey) return;

    if (!userName.trim()) {
      alert("Please enter your name before submitting.");
      return;
    }

    const allResponses = [
      {
        question: "Name of the respondent",
        answer: userName,
      },
      ...Object.entries(responses).map(([index, answer]) => ({
        question: survey.questions[index]?.text || "",
        answer,
      })),
    ];

    const payload = {
      surveyId: survey.id || survey.surveyId,
      version: survey.version || survey.surveyVersion || 1, // Version included here
      survey_name: survey.surveyName || survey.name,        // Optional if you want to save it
      responses: allResponses,
    };

    try {
      await ResultAPI.save(payload);
      alert("Survey submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit survey");
    }
  };

  if (loading) return <p>Loading survey...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!survey) return <p>No survey found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {survey.surveyName || survey.title || "Survey"}
      </h1>

      {/* User Name Input */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Your Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      {survey.questions?.length > 0 ? (
        survey.questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label className="block font-medium mb-1">{q.text}</label>

            {q.type === "text" && (
              <input
                type="text"
                className="border p-2 w-full"
                value={responses[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            )}

            {q.type === "single" &&
              q.options?.map((opt, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    checked={responses[index] === opt}
                    onChange={() => handleChange(index, opt)}
                  />
                  <span className="ml-2">{opt}</span>
                </div>
              ))}

            {q.type === "multi" &&
              q.options?.map((opt, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`question-${index}`}
                    value={opt}
                    checked={responses[index]?.includes(opt) || false}
                    onChange={() => handleMultiSelectChange(index, opt)}
                  />
                  <span className="ml-2">{opt}</span>
                </div>
              ))}
          </div>
        ))
      ) : (
        <p>No questions configured for this survey.</p>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
