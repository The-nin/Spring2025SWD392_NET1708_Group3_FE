import { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function QuizAdmin() {
  const [form] = Form.useForm();
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultQuiz = {
    question: "What is your skin type?",
    options: ["Normal", "Oily", "Sensitive", "Dry"],
    skinTypes: ["NORMAL_SKIN", "OILY_SKIN", "SENSITIVE_SKIN", "DRY_SKIN"],
  };

  useEffect(() => {
    setQuizData([defaultQuiz]);
    form.setFieldsValue({ quiz: [defaultQuiz] });
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("Submitted Quiz Data:", values.quiz);

      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoading(false);
      toast.success("Quiz added successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save the quiz");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(changedValues, allValues) => {
          setQuizData(allValues.quiz);
        }}
      >
        <Form.Item
          name={["quiz", 0, "question"]}
          label="Question"
          rules={[{ required: true, message: "Please enter a question" }]}
        >
          <Input placeholder="Enter quiz question" />
        </Form.Item>

        {quizData[0]?.options.map((_, index) => (
          <Form.Item key={index} label={`Option ${index + 1}`}>
            <Input.Group compact>
              <Form.Item
                name={["quiz", 0, "options", index]}
                rules={[{ required: true, message: "Option required" }]}
              >
                <Input placeholder={`Option ${index + 1}`} />
              </Form.Item>
              <Form.Item
                name={["quiz", 0, "skinTypes", index]}
                rules={[
                  { required: true, message: "Select related skin type" },
                ]}
              >
                <Select placeholder="Skin Type">
                  <Select.Option value="NORMAL_SKIN">Normal</Select.Option>
                  <Select.Option value="OILY_SKIN">Oily</Select.Option>
                  <Select.Option value="SENSITIVE_SKIN">
                    Sensitive
                  </Select.Option>
                  <Select.Option value="DRY_SKIN">Dry</Select.Option>
                  <Select.Option value="COMBINATION_SKIN">
                    Combination
                  </Select.Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Quiz
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default QuizAdmin;
