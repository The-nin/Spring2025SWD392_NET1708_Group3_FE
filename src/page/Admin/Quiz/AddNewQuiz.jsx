import React, { useState } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addQuiz } from "../../../service/quiz/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;
const skinTypes = ["SENSITIVE_SKIN", "OILY_SKIN", "DRY_SKIN", "NORMAL_SKIN"];

const AddNewQuiz = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (!values.title || !values.description || !values.questions) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const quizData = {
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

      console.log("📤 Sending Quiz Data:", quizData);
      const response = await addQuiz(quizData);

      if (response && response.result) {
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

        <Card title="Add New Quiz" className="max-w-6xl mx-auto shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Quiz Title */}
            <Form.Item
              name="title"
              label="Quiz Title"
              rules={[{ required: true, message: "Please enter quiz title" }]}
            >
              <Input placeholder="Enter quiz title" />
            </Form.Item>

            {/* Quiz Description */}
            <Form.Item
              name="description"
              label="Quiz Description"
              rules={[
                { required: true, message: "Please enter quiz description" },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Enter quiz description" />
            </Form.Item>

            {/* Questions */}
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

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Quiz
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewQuiz;
