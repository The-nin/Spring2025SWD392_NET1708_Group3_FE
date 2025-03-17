import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllQuizs } from "../../service/quiz"; // API fetch quiz

function SkinQuiz() {
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await getAllQuizs();
        if (response.code === 200) {
          const activeQuizzes = response.result.filter(
            (q) => q.status === "ACTIVE"
          );
          setActiveQuizzes(activeQuizzes);
        }
      } catch (error) {
        console.error("Lỗi khi tải quiz:", error);
      }
    }
    fetchQuizzes();
  }, []);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAnswer = (answerText) => {
    setSelectedAnswer(answerText);

    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answerText;

      setAnswers(newAnswers);

      if (currentQuestion + 1 < selectedQuiz.question.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1] || null);
      } else {
        calculateResult(newAnswers);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };
  const skinTypeMap = {
    DRY_SKIN: "Da Khô",
    SENSITIVE_SKIN: "Da Nhạy Cảm",
    OILY_SKIN: "Da Dầu",
    NORMAL_SKIN: "Da Thường",
    COMBINATION_SKIN: "Da Hỗn Hợp",
  };
  const calculateResult = (answers) => {
    const skinTypeCounts = answers.reduce((acc, answerText) => {
      const answer = selectedQuiz.question
        .flatMap((q) => q.answers)
        .find((a) => a.answerText === answerText);

      if (answer && answer.skinType) {
        acc[answer.skinType] = (acc[answer.skinType] || 0) + 1;
      }
      return acc;
    }, {});

    // Tìm số lần xuất hiện cao nhất
    const maxCount = Math.max(...Object.values(skinTypeCounts));

    // Lấy danh sách các loại da có số lần xuất hiện cao nhất
    const mostCommonSkinTypes = Object.keys(skinTypeCounts).filter(
      (key) => skinTypeCounts[key] === maxCount
    );

    // Nếu có nhiều hơn 1 loại da xuất hiện nhiều nhất -> "Da Hỗn Hợp"
    const finalResult =
      mostCommonSkinTypes.length > 1
        ? "Da Hỗn Hợp"
        : skinTypeMap[mostCommonSkinTypes[0]] || "Không xác định";

    setResult(finalResult);
  };

  const restartQuiz = () => {
    setSelectedQuiz(null);
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
        <h1 className="text-3xl font-bold">Skin Quiz</h1>
        <p className="text-lg mt-2">Chọn một quiz để bắt đầu!</p>
      </motion.header>

      {/* Chọn Quiz */}
      {!selectedQuiz ? (
        <motion.div
          className="mt-6 bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-semibold text-center">Chọn Quiz:</h2>
          <div className="mt-4 space-y-4">
            {activeQuizzes.length > 0 ? (
              activeQuizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className="cursor-pointer p-4 border border-gray-300 rounded-lg bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Tiêu đề quiz - IN ĐẬM */}
                  <h3 className="text-lg font-bold text-[#CBB596]">
                    {quiz.title}
                  </h3>
                  {/* Mô tả quiz */}
                  {quiz.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {quiz.description}
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">Không có quiz nào đang hoạt động.</p>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full max-w-md">
          {/* Hiển thị quiz đã chọn */}
          <h2 className="text-xl font-bold text-center text-[#CBB596]">
            {selectedQuiz.title}
          </h2>
          {selectedQuiz.description && (
            <p className="text-gray-600 text-center mt-2">
              {selectedQuiz.description}
            </p>
          )}
          {/* Thanh tiến trình */}
          <div className="w-full bg-gray-300 rounded-full h-3 mt-4">
            <motion.div
              className="bg-[#CBB596] h-3 rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  ((currentQuestion + 1) / selectedQuiz.question.length) * 100
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-gray-600 mt-2">
            Câu hỏi {currentQuestion + 1} / {selectedQuiz.question.length}
          </p>
          {/* Hiển thị Quiz */}
          {result ? (
            <motion.div
              className="text-center whitespace-pre-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl font-semibold">Kết quả của bạn:</h2>
              <p className="text-xl mt-4 text-[#CBB596]">{result}</p>
              <p className="text-md mt-4 text-gray-600">
                Nếu bạn có vấn đề về da, hãy tham khảo ý kiến chuyên gia.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={restartQuiz}
                  className="bg-[#CBB596] text-white px-4 py-2 rounded-lg hover:bg-[#B89D84] transition"
                >
                  Chọn lại Quiz
                </button>
                <button
                  onClick={() => navigate("/skin-consultation")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Tư vấn Chuyên gia
                </button>
              </div>
            </motion.div>
          ) : (
            selectedQuiz.question.length > 0 && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-semibold">
                  {selectedQuiz.question[currentQuestion]?.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {selectedQuiz.question[currentQuestion]?.answers?.map(
                    (answer, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(answer.answerText)}
                        className={`block w-full py-3 px-4 rounded-lg text-lg font-medium transition 
                        ${
                          selectedAnswer === answer.answerText
                            ? "bg-[#CBB596] text-white scale-105"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        }
                      `}
                        whileTap={{ scale: 0.95 }}
                      >
                        {answer.answerText}
                      </motion.button>
                    )
                  )}
                </div>

                {/* Nút Quay lại */}
                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    className="mt-4 w-full bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Quay lại
                  </button>
                )}
              </motion.div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default SkinQuiz;
