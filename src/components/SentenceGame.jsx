import React, { useState } from "react";

const EXERCISES = [
  {
    id: "nominal-1",
    englishPrompt: "I am Amma.",
    tiles: ["நான்", "அம்மா"],
    solutions: [["நான்", "அம்மா"]],
  },
  {
    id: "nominal-2",
    englishPrompt: "I am not Amma.",
    tiles: ["நான்", "அம்மா", "இல்லை"],
    solutions: [["நான்", "அம்மா", "இல்லை"]],
  },
  {
    id: "sov-1",
    englishPrompt: "I read the book.",
    tiles: ["நான்", "புத்தகத்தை", "படிக்கிறேன்"],
    solutions: [["நான்", "புத்தகத்தை", "படிக்கிறேன்"]],
  },
];

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((x, i) => x === b[i]);
}

function isCorrectAnswer(ex, attempt) {
  return ex.solutions.some((sol) => arraysEqual(sol, attempt));
}

const SentenceGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const exercise = EXERCISES[currentIndex];

  const handleTileClick = (tile) => {
    setSlots((prev) => [...prev, tile]);
    setFeedback(null);
  };

  const handleSlotClick = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setFeedback(null);
  };

  const handleCheck = () => {
    if (slots.length === 0) return;
    const ok = isCorrectAnswer(exercise, slots);
    setFeedback(ok ? "correct" : "incorrect");
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % EXERCISES.length;
    setCurrentIndex(next);
    setSlots([]);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-xl w-full bg-white shadow-md rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Tamil Sentence Builder</h1>

        <p style={{ color: "#0f172a" }}>
          <span style={{ fontWeight: 600 }}>English:</span> {exercise.englishPrompt}
        </p>

        <div className="mb-4">
          <p className="text-sm" style={{ color: "#64748b", marginBottom: "0.25rem" }}>
            Build the Tamil sentence:
          </p>
          <div
            className="flex flex-wrap gap-2 min-h-[48px] border rounded-lg p-2"
            style={{ backgroundColor: "#f1f5f9", borderColor: "#cbd5f5" }}
          >
            {slots.length === 0 && (
              <span className="text-xs" style={{ color: "#94a3b8" }}>
                Your sentence will appear here…
              </span>
            )}
            {slots.map((word, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSlotClick(idx)}
                className="px-3 py-1 rounded-full border bg-white text-lg"
                style={{ borderColor: "#cbd5f5" }}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm" style={{ color: "#64748b", marginBottom: "0.25rem" }}>
            Tamil tiles:
          </p>
          <div className="flex flex-wrap gap-2">
            {exercise.tiles.map((tile) => (
              <button
                key={tile}
                type="button"
                onClick={() => handleTileClick(tile)}
                className="px-3 py-1 rounded-full border text-lg"
                style={{ backgroundColor: "#e2e8f0", borderColor: "#cbd5f5" }}
              >
                {tile}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            {feedback === "correct" && (
              <span style={{ color: "#16a34a", fontWeight: 500 }}>✔ Correct!</span>
            )}
            {feedback === "incorrect" && (
              <span style={{ color: "#dc2626", fontWeight: 500 }}>✖ Try again.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCheck}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{ backgroundColor: "#10b981", color: "white", borderColor: "#0f766e" }}
            >
              Check
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{ borderColor: "#cbd5f5" }}
            >
              Next
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm" style={{ color: "#64748b" }}>
            Your Tamil sentence:
          </p>
          <p className="text-xl mt-1">{slots.join(" ")}</p>
        </div>
      </div>
    </div>
  );
};

export default SentenceGame;
