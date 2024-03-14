import React from "react";
import { useSelector } from "react-redux";

const Results = () => {
  const cvResults = useSelector((state) => state.cvResults) || [];

  const classifyCandidate = (mark) => {
    if (mark >= 80) {
      return "Excellent";
    } else if (mark >= 60) {
      return "Good";
    } else if (mark >= 40) {
      return "Fair";
    } else {
      return "Poor";
    }
  };

  return (
    <div className="results-container mx-auto max-w-4xl py-8">
      <h2 className="text-3xl font-semibold mb-4">CV Processing Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cvResults.map((result) => (
          <div
            key={result.fileName}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {result.filename.replace(/\.[^/.]+$/, "")}
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Mark:</span> {result.mark}%
            </p>
            <p className="mb-2">
              <span className="font-semibold">Classification:</span>{" "}
              {classifyCandidate(result.mark)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
