import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const questions = [
  {
    question: "How does your skin feel after washing?",
    options: [
      { text: "Tight and dry", type: "dry" },
      { text: "Soft and balanced", type: "normal" },
      { text: "Oily and greasy", type: "oily" },
      { text: "Red or irritated", type: "sensitive" },
    ],
  },
  {
    question: "How often do you experience breakouts?",
    options: [
      { text: "Rarely", type: "dry" },
      { text: "Occasionally", type: "normal" },
      { text: "Frequently", type: "oily" },
      { text: "Only when using new products", type: "sensitive" },
    ],
  },
  {
    question: "How does your skin react to the sun?",
    options: [
      { text: "Burns easily and feels dry", type: "dry" },
      { text: "Tans evenly with minimal irritation", type: "normal" },
      { text: "Gets shiny and oily", type: "oily" },
      { text: "Gets red and inflamed", type: "sensitive" },
    ],
  },
  {
    question: "How often do you use moisturizer?",
    options: [
      { text: "Every day", type: "dry" },
      { text: "Only when needed", type: "normal" },
      { text: "Rarely, it makes me oily", type: "oily" },
      { text: "Always, my skin is sensitive", type: "sensitive" },
    ],
  },
  {
    question: "How does your skin feel at midday?",
    options: [
      { text: "Dry and flaky", type: "dry" },
      { text: "Normal, no issues", type: "normal" },
      { text: "Oily, especially in the T-zone", type: "oily" },
      { text: "Sensitive or irritated", type: "sensitive" },
    ],
  },
  {
    question: "How visible are your pores?",
    options: [
      { text: "Almost invisible", type: "dry" },
      { text: "Small but visible", type: "normal" },
      { text: "Large and noticeable", type: "oily" },
      { text: "Varies with irritation", type: "sensitive" },
    ],
  },
  {
    question: "How does your skin feel in cold weather?",
    options: [
      { text: "Extremely dry", type: "dry" },
      { text: "Slightly drier but manageable", type: "normal" },
      { text: "Oily as usual", type: "oily" },
      { text: "Red and irritated", type: "sensitive" },
    ],
  },
  {
    question: "Do skincare products often cause irritation?",
    options: [
      { text: "Never", type: "dry" },
      { text: "Rarely", type: "normal" },
      { text: "Only with heavy products", type: "oily" },
      { text: "Often, my skin reacts easily", type: "sensitive" },
    ],
  },
  {
    question: "How does your skin feel in humid weather?",
    options: [
      { text: "Still dry", type: "dry" },
      { text: "Normal and balanced", type: "normal" },
      { text: "Extra oily", type: "oily" },
      { text: "Sticky and irritated", type: "sensitive" },
    ],
  },
  {
    question: "What best describes your skin overall?",
    options: [
      { text: "Dry, rough, or flaky", type: "dry" },
      { text: "Normal and healthy", type: "normal" },
      { text: "Oily and shiny", type: "oily" },
      { text: "Sensitive and reactive", type: "sensitive" },
    ],
  },
];

function SkinQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();

  const handleAnswer = (type) => {
    setSelectedAnswer(type);

    setTimeout(() => {
      const newAnswers = [...answers, type];
      setAnswers(newAnswers);

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        calculateResult(newAnswers);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setAnswers(answers.slice(0, -1)); // Remove last answer
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const calculateResult = (answers) => {
    const totalAnswers = answers.length;
    const typeCounts = answers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const formattedResults = Object.keys(typeCounts)
      .map(
        (type) =>
          `${Math.round((typeCounts[type] / totalAnswers) * 100)}% ${
            type.charAt(0).toUpperCase() + type.slice(1)
          }`
      )
      .join("\n");

    setResult(formattedResults);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <motion.header
        className="bg-black text-white py-6 px-4 text-center w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold">Skin&apos;s Quiz</h1>
        <p className="text-lg mt-2">Discover your skin type with our quiz!</p>
      </motion.header>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-4">
        <div className="w-full bg-gray-300 rounded-full h-3">
          <motion.div
            className="bg-blue-600 h-3 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-gray-600 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Quiz Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full max-w-md">
        {result ? (
          <motion.div
            className="text-center whitespace-pre-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold">
              Your Skin Type Breakdown:
            </h2>
            <p className="text-xl mt-4 text-blue-600">{result}</p>
            <p className="text-md mt-4 text-gray-600">
              If you experience persistent skin issues, consult an expert.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={restartQuiz}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/skin-consultation")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Consult an Expert
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold">
              {questions[currentQuestion].question}
            </h2>
            <div className="mt-4 space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option.type)}
                  className={`block w-full py-3 px-4 rounded-lg text-lg font-medium transition 
                    ${
                      selectedAnswer === option.type
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.text}
                </motion.button>
              ))}
            </div>

            {/* Back Button */}
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="mt-4 w-full bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SkinQuiz;
