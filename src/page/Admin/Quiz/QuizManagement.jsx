import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizById, updateQuiz } from "../../../service/quiz/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;
const skinTypes = ["SENSITIVE_SKIN", "OILY_SKIN", "DRY_SKIN", "NORMAL_SKIN"];

const EditQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuizById(id);
        if (response && response.result) {
          form.setFieldsValue(response.result);
        } else {
          toast.error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Error fetching quiz");
      }
    };
    fetchQuiz();
  }, [id, form]);

  const onFinish = async (values) => {
    if (!values.title || !values.description || !values.questions) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const quizData = {
        id,
        title: values.title,
        description: values.description,
        questions: values.questions.map((q) => ({
          title: q.title,
          answers: q.answers.map((a) => ({
            answerText: a.answerText,
            skinType: a.skinType,
          })),
        })),
      };

      const response = await updateQuiz(quizData);

      if (response && response.result) {
        toast.success("Quiz updated successfully!");
        setTimeout(() => navigate("/admin/quiz"), 2000);
      } else {
        toast.error(response?.message || "Error updating quiz");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update quiz");
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
          Back to Quizzes
        </Button>

        <Card title="Edit Quiz" className="max-w-6xl mx-auto shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="title"
              label="Quiz Title"
              rules={[{ required: true, message: "Please enter quiz title" }]}
            >
              <Input placeholder="Enter quiz title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Quiz Description"
              rules={[
                { required: true, message: "Please enter quiz description" },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Enter quiz description" />
            </Form.Item>

            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      className="mb-4"
                      title={`Question ${key + 1}`}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        label="Question Title"
                        rules={[
                          {
                            required: true,
                            message: "Please enter question title",
                          },
                        ]}
                      >
                        <Input placeholder="Enter question title" />
                      </Form.Item>

                      <Form.List name={[name, "answers"]}>
                        {(
                          answerFields,
                          { add: addAnswer, remove: removeAnswer }
                        ) => (
                          <div>
                            {answerFields.map(
                              ({
                                key: answerKey,
                                name: answerName,
                                ...answerRestField
                              }) => (
                                <div key={answerKey} className="flex gap-2">
                                  <Form.Item
                                    {...answerRestField}
                                    name={[answerName, "answerText"]}
                                    label="Answer Text"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter answer text",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Enter answer text" />
                                  </Form.Item>
                                  <Form.Item
                                    {...answerRestField}
                                    name={[answerName, "skinType"]}
                                    label="Skin Type"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select skin type",
                                      },
                                    ]}
                                  >
                                    <Select placeholder="Select skin type">
                                      {skinTypes.map((type) => (
                                        <Option key={type} value={type}>
                                          {type}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => removeAnswer(answerName)}
                                  >
                                    Remove Answer
                                  </Button>
                                </div>
                              )
                            )}
                            <Button type="dashed" onClick={() => addAnswer()}>
                              Add Answer
                            </Button>
                          </div>
                        )}
                      </Form.List>

                      <Button type="dashed" onClick={() => remove(name)}>
                        Remove Question
                      </Button>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()}>
                    Add Question
                  </Button>
                </div>
              )}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Quiz
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditQuiz;
