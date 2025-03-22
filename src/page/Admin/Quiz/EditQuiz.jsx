import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizById, updateQuiz } from "../../../service/quiz/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const EditQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await getQuizById(id);
        if (response && response.result) {
          setQuiz(response.result);
          form.setFieldsValue({
            title: response.result.title,
            description: response.result.description,
            questions: response.result.question || [],
          });
        } else {
          toast.error("Không thể tải Bộ trắc nghiệm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Bộ trắc nghiệm:", error);
        toast.error("Lỗi khi lấy dữ liệu Bộ trắc nghiệm");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, form]);

  // Xóa câu hỏi (cập nhật isDeleted)
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = form
      .getFieldValue("questions")
      .map((q, qIndex) => (qIndex === index ? { ...q, isDeleted: true } : q));

    form.setFieldsValue({ questions: updatedQuestions });
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Xóa câu trả lời (cập nhật isDeleted)
  const handleDeleteAnswer = (qIndex, aIndex) => {
    const updatedQuestions = form.getFieldValue("questions").map((q, qIdx) => {
      if (qIdx === qIndex) {
        return {
          ...q,
          answers: q.answers.map((a, aIdx) =>
            aIdx === aIndex ? { ...a, isDeleted: true } : a
          ),
        };
      }
      return q;
    });

    form.setFieldsValue({ questions: updatedQuestions });
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Xử lý cập nhật quiz
  const onFinish = async (values) => {
    if (!values.title || !values.description) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const updatedQuizData = {
        title: values.title,
        description: values.description,
        questions: values.questions
          ? values.questions
              .filter((q) => !q.isDeleted) // Bỏ câu hỏi bị xóa
              .map((q, index) => ({
                questionId: q.questionId || index + 1,
                title: q.title,
                answers: q.answers
                  ? q.answers
                      .filter((a) => !a.isDeleted) // Bỏ câu trả lời bị xóa
                      .map((a, idx) => ({
                        answerId: a.answerId || idx + 1,
                        answerText: a.answerText,
                        skinType: a.skinType,
                      }))
                  : [],
              }))
          : [],
      };

      console.log("📤 Đang cập nhật Bộ trắc nghiệm:", updatedQuizData);

      const response = await updateQuiz(id, updatedQuizData);
      if (!response.error) {
        setTimeout(() => navigate("/admin/quiz"), 2000);
        toast.success("Bộ trắc nghiệm đã được cập nhật thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không thể cập nhật Bộ trắc nghiệm");
    } finally {
      setLoading(false);
    }
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
          Quay lại danh sách Bộ trắc nghiệm
        </Button>

        <Card
          title="Chỉnh sửa Bộ trắc nghiệm"
          className="max-w-6xl mx-auto shadow-md"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="title"
              label="Tiêu đề Bộ trắc nghiệm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu đề Bộ trắc nghiệm",
                },
              ]}
            >
              <Input placeholder="Nhập tiêu đề Bộ trắc nghiệm" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả Bộ trắc nghiệm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả Bộ trắc nghiệm",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả Bộ trắc nghiệm"
              />
            </Form.Item>

            <Form.List name="questions">
              {(fields, { add }) => (
                <div>
                  {fields.map(({ key, name }) => {
                    const question = form.getFieldValue(["questions", name]);
                    if (question?.isDeleted) return null;

                    return (
                      <Card
                        key={key}
                        className="mb-4"
                        title={`Câu hỏi ${key + 1}`}
                      >
                        <Form.Item
                          name={[name, "title"]}
                          label="Tiêu đề câu hỏi"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tiêu đề câu hỏi",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập tiêu đề câu hỏi" />
                        </Form.Item>

                        <Form.List name={[name, "answers"]}>
                          {(answerFields, { add: addAnswer }) => (
                            <div>
                              {answerFields.map(
                                ({ key: answerKey, name: answerName }) => {
                                  const answer = form.getFieldValue([
                                    "questions",
                                    name,
                                    "answers",
                                    answerName,
                                  ]);
                                  if (answer?.isDeleted) return null;

                                  return (
                                    <div
                                      key={answerKey}
                                      className="flex gap-4 items-end"
                                    >
                                      <Form.Item
                                        name={[answerName, "answerText"]}
                                        label="Câu trả lời"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Vui lòng nhập câu trả lời",
                                          },
                                        ]}
                                        className="flex-1"
                                      >
                                        <Input placeholder="Nhập câu trả lời" />
                                      </Form.Item>

                                      <Form.Item
                                        name={[answerName, "skinType"]}
                                        label="Loại Skin"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Vui lòng chọn loại Skin",
                                          },
                                        ]}
                                        className="flex-1"
                                      >
                                        <Select placeholder="Chọn loại Skin">
                                          <Option value="DRY_SKIN">
                                            Da khô
                                          </Option>
                                          <Option value="NORMAL_SKIN">
                                            Da thường
                                          </Option>
                                          <Option value="OILY_SKIN">
                                            Da dầu
                                          </Option>
                                          <Option value="SENSITIVE_SKIN">
                                            Da nhạy cảm
                                          </Option>
                                        </Select>
                                      </Form.Item>
                                    </div>
                                  );
                                }
                              )}
                              <Button type="dashed" onClick={() => addAnswer()}>
                                Thêm câu trả lời
                              </Button>
                            </div>
                          )}
                        </Form.List>

                        <Button
                          type="dashed"
                          onClick={() => handleDeleteQuestion(name)}
                        >
                          Xóa câu hỏi
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật Bộ trắc nghiệm
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditQuiz;
