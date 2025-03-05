import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Alert, Spin } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getQuizById, updateQuiz } from "../../../service/quiz/index"; // Import API calls

function EditQuiz() {
  const { quizId } = useParams(); // Get quiz ID from URL
  const navigate = useNavigate(); // Initialize navigation

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      const response = await getQuizById(quizId);

      if (!response.error) {
        setQuizData(response.result);
        form.setFieldsValue({ quiz: [response.result] });
      } else {
        toast.error("Failed to load quiz details");
        navigate("/admin/quiz"); // Redirect if error
      }
      setLoading(false);
    };

    fetchQuizDetails();
  }, [quizId, form, navigate]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("📤 Updating Quiz Data:", values.quiz);

      const response = await updateQuiz(quizId, values.quiz[0]);

      if (!response.error) {
        toast.success("Quiz updated successfully!");
        navigate("/admin/quiz"); // Redirect after update
      } else {
        toast.error(response.message || "Failed to update quiz");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !quizData) {
    return (
      <Spin
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/quiz")}
        className="mb-4"
      >
        Back to Quizzes
      </Button>
      <h2 className="text-2xl font-bold mb-4">Edit Quiz</h2>

      <Alert
        message="Edit Quiz Information"
        description="Modify the question and options as needed. Ensure each option is linked to a skin type."
        type="info"
        showIcon
        className="mb-4"
      />

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

        {quizData.options.map((_, index) => (
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
            Update Quiz
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditQuiz;
