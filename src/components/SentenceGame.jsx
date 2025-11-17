import React, { useState, useMemo } from "react";

// Each exercise is explicitly grounded in the grammar PDF,
// but explanations are simplified for Yogi.
const EXERCISES = [
  // ===== NOMINAL SENTENCES =====
  {
    id: "nominal-1",
    concept: "Nominal sentence",
    level: 1,
    englishPrompt: "I am Amma.",
    tamilTarget: "நான் அம்மா",
    explanation:
      "Tamil doesn’t use a word like 'am' here. Two nouns side by side make a full sentence: நான் + அம்மா.",
    tiles: ["நான்", "அம்மா"],
    solutions: [["நான்", "அம்மா"]],
  },
  {
    id: "nominal-2",
    concept: "Nominal sentence",
    level: 1,
    englishPrompt: "I am not Amma.",
    tamilTarget: "நான் அம்மா இல்லை",
    explanation:
      "To negate a nominal sentence, you just add இல்லை (no / not) at the end.",
    tiles: ["நான்", "அம்மா", "இல்லை"],
    solutions: [["நான்", "அம்மா", "இல்லை"]],
  },
  {
    id: "nominal-3",
    concept: "Nominal sentence",
    level: 1,
    englishPrompt: "Am I Amma?",
    tamilTarget: "நான் அம்மனா?",
    explanation:
      "Yes/no questions add the sound -ஆ to the second noun: அம்மா → அம்மனா?.",
    tiles: ["நான்", "அம்மனா?"],
    solutions: [["நான்", "அம்மனா?"]],
  },
  {
    id: "nominal-4",
    concept: "Nominal sentence",
    level: 1,
    englishPrompt: "Who am I?",
    tamilTarget: "நான் யார்?",
    explanation:
      "If the second word is a question word like யார்? (who?), you don’t add -ஆ. Just நான் + யார்?.",
    tiles: ["நான்", "யார்?"],
    solutions: [["நான்", "யார்?"]],
  },

  // ===== SOV + NULL-SUBJECT =====
  {
    id: "sov-1",
    concept: "Null-subject verb",
    level: 2,
    englishPrompt: "I am reading / learning.",
    tamilTarget: "படிக்கிறேன்",
    explanation:
      "One verb form can be a whole sentence. The ending -கிறேன் already tells us 'I (present tense)'. No நான் needed.",
    tiles: ["படிக்கிறேன்"],
    solutions: [["படிக்கிறேன்"]],
  },
  {
    id: "sov-2",
    concept: "SOV structure",
    level: 2,
    englishPrompt: "I read the book.",
    tamilTarget: "நான் புத்தகத்தை படிக்கிறேன்",
    explanation:
      "Basic Tamil word order is Subject–Object–Verb: நான் (subject) + புத்தகத்தை (book + -ஐ object) + படிக்கிறேன் (verb).",
    tiles: ["நான்", "புத்தகத்தை", "படிக்கிறேன்"],
    solutions: [["நான்", "புத்தகத்தை", "படிக்கிறேன்"]],
  },

  // ===== CASE-MARKED OBJECTS & INDIRECT OBJECTS =====
  {
    id: "case-1",
    concept: "Accusative (-ஐ)",
    level: 3,
    englishPrompt: "Seeran met Maaran.",
    tamilTarget: "சேரன் மாறனை சந்தித்தான்",
    explanation:
      "The object gets the -ஐ ending. மாறன் (Maaran) → மாறனை (Maaran + -ஐ). Sentence is Subject–Object–Verb.",
    tiles: ["சேரன்", "மாறனை", "சந்தித்தான்"],
    solutions: [["சேரன்", "மாறனை", "சந்தித்தான்"]],
  },
  {
    id: "case-2",
    concept: "Dative (-உக்கு)",
    level: 3,
    englishPrompt: "Seeran gave the book to Maaran.",
    tamilTarget: "சேரன் மாறனுக்கு புத்தகத்தை கொடுத்தான்",
    explanation:
      "Dative -உக்கு marks 'to whom'. மாறன் → மாறனுக்கு (to Maaran). புத்தகத்தை has -ஐ to mark the direct object.",
    tiles: ["சேரன்", "மாறனுக்கு", "புத்தகத்தை", "கொடுத்தான்"],
    // allow two natural orders: S-IO-O-V and S-O-IO-V
    solutions: [
      ["சேரன்", "மாறனுக்கு", "புத்தகத்தை", "கொடுத்தான்"],
      ["சேரன்", "புத்தகத்தை", "மாறனுக்கு", "கொடுத்தான்"],
    ],
  },

  // ===== LOCATIVE / PLACE (optional but nice) =====
  {
    id: "case-3",
    concept: "Locative (-இல்)",
    level: 3,
    englishPrompt: "The boy is in the house.",
    tamilTarget: "பையன் வீட்டில் இருக்கிறான்",
    explanation:
      "-இல் marks 'in / at'. வீடு (house) → வீட்டில் (in the house). Verb still comes last.",
    tiles: ["பையன்", "வீட்டில்", "இருக்கிறான்"],
    solutions: [["பையன்", "வீட்டில்", "இருக்கிறான்"]],
  },

  // ===== SERIAL VERBS (ADVANCED) =====
  {
    id: "serial-1",
    concept: "Serial verbs (advanced)",
    level: 4,
    englishPrompt: "I took the book, went to school, and studied the lesson.",
    tamilTarget: "நான் புத்தகத்தை எடுத்துப் பாடசாலைக்குச் சென்று பாடம் படித்தேன்",
    explanation:
      "Serial verbs chain actions. The last verb படித்தேன் is the main finite verb. எடுத்து, சென்று share its person/tense.",
    tiles: [
      "நான்",
      "புத்தகத்தை",
      "எடுத்துப்",
      "பாடசாலைக்குச்",
      "சென்று",
      "பாடம்",
      "படித்தேன்",
    ],
    solutions: [
      [
        "நான்",
        "புத்தகத்தை",
        "எடுத்துப்",
        "பாடசாலைக்குச்",
        "சென்று",
        "பாடம்",
        "படித்தேன்",
      ],
    ],
  },
];

// Helper: compare two arrays of tiles
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((x, i) => x === b[i]);
}

function isCorrectAnswer(ex, attempt) {
  return ex.solutions.some((sol) => arraysEqual(sol, attempt));
}

const SentenceGame = () => {
  const [currentConcept, setCurrentConcept] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [feedback, setFeedback] = useState(null); // "correct" | "incorrect" | null

  const concepts = useMemo(() => {
    const base = ["All"];
    const unique = Array.from(new Set(EXERCISES.map((e) => e.concept)));
    return base.concat(unique);
  }, []);

  const filteredExercises = useMemo(() => {
    if (currentConcept === "All") return EXERCISES;
    return EXERCISES.filter((e) => e.concept === currentConcept);
  }, [currentConcept]);

  const exercise = filteredExercises[currentIndex] || filteredExercises[0];

  const handleTileClick = (tile) => {
    setSlots((prev) => [...prev, tile]);
    setFeedback(null);
  };

  const handleSlotClick = (index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setFeedback(null);
  };

  const handleClear = () => {
    setSlots([]);
    setFeedback(null);
  };

  const handleCheck = () => {
    if (!exercise || slots.length === 0) return;
    const ok = isCorrectAnswer(exercise, slots);
    setFeedback(ok ? "correct" : "incorrect");
  };

  const goToExercise = (newIndex) => {
    let idx = newIndex;
    const total = filteredExercises.length;
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    setCurrentIndex(idx);
    setSlots([]);
    setFeedback(null);
  };

  const handleNext = () => {
    goToExercise(currentIndex + 1);
  };

  const handlePrev = () => {
    goToExercise(currentIndex - 1);
  };

  const handleConceptChange = (e) => {
    const newConcept = e.target.value;
    setCurrentConcept(newConcept);
    setCurrentIndex(0);
    setSlots([]);
    setFeedback(null);
  };

  if (!exercise) {
    return <div>Loading…</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-6 space-y-4">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tamil Sentence Builder</h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Practising: {exercise.concept} · Level {exercise.level}
            </p>
          </div>

          {/* Concept filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="conceptSelect"
              style={{ fontSize: "0.85rem", color: "#475569" }}
            >
              Focus:
            </label>
            <select
              id="conceptSelect"
              value={currentConcept}
              onChange={handleConceptChange}
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "999px",
                border: "1px solid #cbd5f5",
                fontSize: "0.85rem",
                backgroundColor: "#f1f5f9",
              }}
            >
              {concepts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Prompt + target (for parent/teacher reference) */}
        <section className="space-y-1">
          <p style={{ color: "#0f172a" }}>
            <span style={{ fontWeight: 600 }}>English:</span> {exercise.englishPrompt}
          </p>
          <p style={{ color: "#0f172a" }}>
            <span style={{ fontWeight: 600 }}>Target Tamil:</span>{" "}
            <span style={{ fontSize: "1.1rem" }}>{exercise.tamilTarget}</span>
          </p>
        </section>

        {/* Pattern explanation */}
        <section
          style={{
            backgroundColor: "#eff6ff",
            borderRadius: "0.75rem",
            padding: "0.75rem 1rem",
            border: "1px solid #bfdbfe",
            fontSize: "0.85rem",
            color: "#1e293b",
          }}
        >
          <span style={{ fontWeight: 600 }}>Pattern tip:</span>{" "}
          {exercise.explanation}
        </section>

        {/* Slots */}
        <section>
          <p
            className="text-sm"
            style={{ color: "#64748b", marginBottom: "0.25rem" }}
          >
            Build the Tamil sentence by clicking the tiles:
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
                title="Click to remove this word"
              >
                {word}
              </button>
            ))}
          </div>
        </section>

        {/* Tiles */}
        <section>
          <p
            className="text-sm"
            style={{ color: "#64748b", marginBottom: "0.25rem" }}
          >
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
        </section>

        {/* Feedback + controls */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {feedback === "correct" && (
              <span style={{ color: "#16a34a", fontWeight: 500 }}>
                ✔ Correct! Super.
              </span>
            )}
            {feedback === "incorrect" && (
              <span style={{ color: "#dc2626", fontWeight: 500 }}>
                ✖ Not quite. Try moving or removing a word.
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{ borderColor: "#cbd5f5" }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCheck}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{
                backgroundColor: "#10b981",
                color: "white",
                borderColor: "#0f766e",
              }}
            >
              Check
            </button>
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{ borderColor: "#cbd5f5" }}
            >
              ◀ Prev
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 rounded-lg border text-sm"
              style={{ borderColor: "#cbd5f5" }}
            >
              Next ▶
            </button>
          </div>
        </section>

        {/* Live sentence preview */}
        <section className="text-center">
          <p className="text-sm" style={{ color: "#64748b" }}>
            Your Tamil sentence:
          </p>
          <p className="text-xl mt-1">{slots.join(" ")}</p>
        </section>
      </div>
    </div>
  );
};

export default SentenceGame;
