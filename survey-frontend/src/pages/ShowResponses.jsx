import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResultAPI } from "../api/client";

export default function ShowResponses() {
  const { id } = useParams(); // this is the surveyId
  const [responses, setResponses] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    ResultAPI.getAll()
      .then((data) => {
        console.log("All Results API response:", data);

        // Filter only results that belong to this survey ID
        const filtered = (data || []).filter(
          (item) => String(item.surveyId) === String(id)
        );

        const parsedData = filtered.map((item) => ({
          ...item,
          responses: typeof item.responses === "string" ? JSON.parse(item.responses) : item.responses,
        }));

        // Extract unique versions
        const uniqueVersions = [
          ...new Set(parsedData.map((r) => r.version)),
        ].sort((a, b) => a - b);

        setResponses(parsedData);
        setVersions(uniqueVersions);
        setSelectedVersion(uniqueVersions[uniqueVersions.length - 1]); // latest version
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError("Failed to load responses");
        setLoading(false);
      });
  }, [id]);

  const filteredResponses = selectedVersion
    ? responses.filter((r) => r.version === selectedVersion)
    : responses;

  if (loading) return <p>Loading responses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!responses.length) return <p>No responses found for this survey.</p>;

  const questionHeaders =
    filteredResponses[0]?.responses?.slice(1).map((resp) => resp.question) || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Survey Responses</h1>

      {versions.length > 1 && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Select Version</label>
          <select
            className="border p-2"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(Number(e.target.value))}
          >
            {versions.map((v) => (
              <option key={v} value={v}>
                Version {v}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Respondent Name</th>
              {questionHeaders.map((q, i) => (
                <th key={i} className="border px-4 py-2">{q}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map((r, idx) => {
              const name = r.responses?.[0]?.answer || "Unknown";
              const answers = r.responses?.slice(1).map((resp) =>
                Array.isArray(resp.answer) ? resp.answer.join(", ") : resp.answer
              );

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{name}</td>
                  {answers?.map((a, i) => (
                    <td key={i} className="border px-4 py-2">{a || "-"}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
