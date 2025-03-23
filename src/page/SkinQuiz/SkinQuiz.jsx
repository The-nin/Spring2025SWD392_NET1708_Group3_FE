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
      setAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        newAnswers[currentQuestion] = answerText;

        // Nếu đây là câu hỏi cuối cùng, gọi `calculateResult`
        if (currentQuestion + 1 === selectedQuiz.question.length) {
          setTimeout(() => calculateResult(newAnswers), 300);
        }

        return newAnswers;
      });

      if (currentQuestion + 1 < selectedQuiz.question.length) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
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
  const calculateResult = (finalAnswers) => {
    const skinTypeCounts = finalAnswers.reduce((acc, answerText) => {
      const answer = selectedQuiz.question
        .flatMap((q) => q.answers)
        .find((a) => a.answerText === answerText);

      if (answer && answer.skinType) {
        acc[answer.skinType] = (acc[answer.skinType] || 0) + 1;
      }
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(skinTypeCounts));

    // Lọc ra tất cả loại da có số lần xuất hiện bằng maxCount
    const mostCommonSkinTypes = Object.keys(skinTypeCounts).filter(
      (key) => skinTypeCounts[key] === maxCount
    );

    let finalResult;

    if (mostCommonSkinTypes.length === 1) {
      // Nếu chỉ có một loại da chiếm ưu thế
      finalResult = skinTypeMap[mostCommonSkinTypes[0]] || "Không xác định";
    } else if (mostCommonSkinTypes.length > 1) {
      // Nếu có nhiều loại da có cùng số lần xuất hiện
      finalResult = "Da Hỗn Hợp";
    } else {
      finalResult = "Không xác định";
    }

    setResult(finalResult);
  };

  const restartQuiz = () => {
    setSelectedQuiz(null);
    setAnswers([]);
    setResult(null);
    setSelectedAnswer(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 max-w-4xl mx-auto my-8"
    >
      {/* Header */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-light">Skin Quiz</h1>
        <p className="text-gray-500 mt-1">Xác định loại da của bạn</p>
      </div>

      {!selectedQuiz ? (
        <motion.div
          className="p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-medium mb-6">Chọn Quiz:</h2>
          <div className="grid gap-4">
            {activeQuizzes.length > 0 ? (
              activeQuizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className="p-6 rounded-xl text-left transition-all duration-200 border-2 border-gray-200 hover:border-gray-400 cursor-pointer"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-semibold text-black">
                    {quiz.title}
                  </h3>
                  {quiz.description && (
                    <p className="text-gray-600 mt-2">{quiz.description}</p>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">Không có quiz nào đang hoạt động.</p>
            )}
          </div>
        </motion.div>
      ) : (
        <div>
          {/* Thanh tiến độ */}
          {!result && (
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-light">{selectedQuiz.title}</h2>
                <span className="text-sm text-gray-500">
                  Câu hỏi {currentQuestion + 1} trong{" "}
                  {selectedQuiz.question.length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${
                      ((currentQuestion + 1) / selectedQuiz.question.length) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <div className="p-8">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl font-light mb-2">Loại Da Của Bạn</h2>
                <h3 className="text-4xl font-semibold mb-8">{result}</h3>

                <div className="max-w-3xl mx-auto mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-lg leading-relaxed text-gray-700">
                    Dựa trên câu trả lời của bạn, chúng tôi xác định loại da của
                    bạn là {result}. Hãy tham khảo ý kiến chuyên gia để có
                    phương pháp chăm sóc phù hợp nhất.
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mt-10">
                  <motion.button
                    onClick={restartQuiz}
                    className="px-8 py-3 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Chọn lại Quiz
                  </motion.button>

                  <motion.button
                    onClick={() => navigate("/skin-consultation")}
                    className="px-8 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Tư vấn Chuyên gia
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              selectedQuiz.question.length > 0 && (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-light mb-6">
                    {selectedQuiz.question[currentQuestion]?.title}
                  </h2>

                  <div className="grid grid-cols-1 gap-4 mb-10">
                    {selectedQuiz.question[currentQuestion]?.answers?.map(
                      (answer, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(answer.answerText)}
                          className={`
                            p-6 rounded-xl text-left transition-all duration-200 border-2
                            ${
                              selectedAnswer === answer.answerText
                                ? "border-black"
                                : "border-gray-200 hover:border-gray-400"
                            }
                          `}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <div
                              className={`
                                w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0
                                ${
                                  selectedAnswer === answer.answerText
                                    ? "border-black"
                                    : "border-gray-400"
                                }
                              `}
                            >
                              {selectedAnswer === answer.answerText && (
                                <div className="w-3 h-3 bg-black rounded-full m-auto"></div>
                              )}
                            </div>
                            <span className="text-lg">{answer.answerText}</span>
                          </div>
                        </motion.button>
                      )
                    )}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    {currentQuestion > 0 && (
                      <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-lg border border-gray-800 text-gray-800 hover:bg-gray-100"
                      >
                        Quay Lại
                      </button>
                    )}
                    {currentQuestion < selectedQuiz.question.length - 1 ? (
                      <button
                        onClick={() =>
                          selectedAnswer && handleAnswer(selectedAnswer)
                        }
                        disabled={!selectedAnswer}
                        className={`
                          px-6 py-3 rounded-lg ml-auto
                          ${
                            !selectedAnswer
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }
                        `}
                      >
                        Tiếp Theo
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          selectedAnswer && handleAnswer(selectedAnswer)
                        }
                        disabled={!selectedAnswer}
                        className={`
                          px-8 py-3 rounded-lg ml-auto
                          ${
                            !selectedAnswer
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }
                        `}
                      >
                        Xem Kết Quả
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default SkinQuiz;
