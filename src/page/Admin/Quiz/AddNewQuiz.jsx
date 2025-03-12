import React, { useState } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addQuiz } from "../../../service/quiz/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const AddNewQuiz = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      title: "",
      questionId: Date.now(),
      answers: [
        { answerId: Date.now(), answerText: "", skinType: "SENSITIVE_SKIN" },
      ],
    },
  ]);

  // ✅ Handle form submission
  const onFinish = async (values) => {
    if (
      !values.title.trim() ||
      !values.description.trim() ||
      questions.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const formattedQuiz = {
      title: values.title,
      description: values.description,
      questions,
    };

    try {
      setLoading(true);
      console.log("📤 Sending Quiz Data:", formattedQuiz);
      const response = await addQuiz(formattedQuiz);

      if (response) {
        toast.success("Quiz added successfully!");
        setTimeout(() => navigate("/admin/quiz"), 2000);
      } else {
        toast.error(response?.message || "Error adding quiz");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add quiz");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        questionId: Date.now(),
        answers: [
          { answerId: Date.now(), answerText: "", skinType: "SENSITIVE_SKIN" },
        ],
      },
    ]);
  };

  // ✅ Remove a question
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  // ✅ Update question title
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].title = value;
    setQuestions(updatedQuestions);
  };

  // ✅ Add answer to a question
  const addAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({
      answerId: Date.now(),
      answerText: "",
      skinType: "SENSITIVE_SKIN",
    });
    setQuestions(updatedQuestions);
  };

  // ✅ Remove an answer from a question
  const removeAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].answers.length > 1) {
      updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  // ✅ Update answer text
  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex].answerText = value;
    setQuestions(updatedQuestions);
  };

  // ✅ Update answer skin type
  const handleSkinTypeChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex].skinType = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/quiz")}
          className="mb-4 hover:bg-gray-100"
        >
          Quay lại danh sách Quiz
        </Button>

        <Card title="Thêm Quiz Mới" className="max-w-4xl mx-auto shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Tiêu đề Quiz */}
            <Form.Item
              name="title"
              label="Tiêu Đề Quiz"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề quiz" },
              ]}
            >
              <Input placeholder="Nhập tiêu đề quiz" />
            </Form.Item>

            {/* Mô tả Quiz */}
            <Form.Item
              name="description"
              label="Mô Tả Quiz"
              rules={[{ required: true, message: "Vui lòng nhập mô tả quiz" }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả quiz" />
            </Form.Item>

            {/* Câu hỏi động */}
            {questions.map((question, qIndex) => (
              <Card key={question.questionId} className="mb-4">
                <Form.Item
                  label={`Câu Hỏi ${qIndex + 1}`}
                  required
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung câu hỏi",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập nội dung câu hỏi"
                    value={question.title}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                  />
                </Form.Item>

                {/* Đáp án cho câu hỏi này */}
                {question.answers.map((answer, aIndex) => (
                  <div
                    key={answer.answerId}
                    className="flex space-x-2 items-center mb-2"
                  >
                    <Input
                      placeholder="Nhập đáp án"
                      value={answer.answerText}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex, e.target.value)
                      }
                      style={{ width: "60%" }}
                    />
                    <Select
                      value={answer.skinType}
                      onChange={(value) =>
                        handleSkinTypeChange(qIndex, aIndex, value)
                      }
                      style={{ width: "30%" }}
                    >
                      <Option value="SENSITIVE_SKIN">Da Nhạy Cảm</Option>
                      <Option value="OILY_SKIN">Da Dầu</Option>
                      <Option value="DRY_SKIN">Da Khô</Option>
                      <Option value="COMBINATION_SKIN">Da Hỗn Hợp</Option>
                    </Select>
                    <Button
                      type="danger"
                      onClick={() => removeAnswer(qIndex, aIndex)}
                    >
                      -
                    </Button>
                  </div>
                ))}

                <Button type="dashed" onClick={() => addAnswer(qIndex)}>
                  + Thêm Đáp Án
                </Button>

                {questions.length > 1 && (
                  <Button
                    type="link"
                    danger
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Xóa Câu Hỏi
                  </Button>
                )}
              </Card>
            ))}

            <Button type="dashed" onClick={addQuestion}>
              + Thêm Câu Hỏi
            </Button>

            {/* Nút gửi */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm Quiz
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewQuiz;
