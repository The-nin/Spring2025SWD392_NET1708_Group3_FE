import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Space, Tooltip, Modal, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllQuizs,
  deleteQuiz,
  updateQuizStatus,
} from "../../../service/quiz/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizManagement = () => {
  const navigate = useNavigate();
  const tokenRef = useRef(localStorage.getItem("token")); // 🔹 Store token in useRef to avoid redundant calls

  const [loading, setLoading] = useState(false);
  const [quizs, setQuizs] = useState(null); // 🔹 Use null to differentiate between "loading" and "empty list"
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 🔹 Fetch quizzes
  const fetchQuizs = async () => {
    if (quizs) return; // Avoid unnecessary API calls if data is already present

    try {
      setLoading(true);
      const response = await getAllQuizs();

      if (!response.error) {
        setQuizs(response.result || []);
        setPagination((prev) => ({
          ...prev,
          total: response.total || prev.total, // Ensure total count updates
        }));
      } else {
        toast.error(response.message || "Failed to fetch quizzes");
      }
    } catch (error) {
      console.error("Fetch Quiz Error:", error);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial fetch on mount
  useEffect(() => {
    fetchQuizs();
  }, []);

  // 🔹 Handle pagination changes
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchQuizs();
  };

  // 🔹 Show delete confirmation modal
  const showDeleteConfirm = (quiz) => {
    setSelectedQuiz(quiz);
    setDeleteModalVisible(true);
  };

  // 🔹 Handle delete quiz
  const handleDeleteConfirm = async () => {
    if (!selectedQuiz || !tokenRef.current) return;

    try {
      setLoading(true);
      const response = await deleteQuiz(selectedQuiz.id, tokenRef.current);

      if (!response.error) {
        toast.success("Quiz deleted successfully!");
        setQuizs((prev) => prev.filter((q) => q.id !== selectedQuiz.id)); // Remove deleted quiz
      } else {
        toast.error(response.message || "Failed to delete quiz");
      }
    } catch (error) {
      console.error("Delete Quiz Error:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedQuiz(null);
    }
  };

  // 🔹 Toggle quiz status
  const toggleQuizStatus = async (quiz) => {
    if (!tokenRef.current) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const newStatus = quiz.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateQuizStatus(
        quiz.id,
        newStatus,
        tokenRef.current
      );

      if (!response.error) {
        toast.success("Quiz status updated successfully!");
        setQuizs((prev) =>
          prev.map((q) => (q.id === quiz.id ? { ...q, status: newStatus } : q))
        );
      } else {
        toast.error(response.message || "Failed to update quiz status");
      }
    } catch (error) {
      console.error("Update Quiz Status Error:", error);
      toast.error("Failed to update quiz status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (questions) => (
        <ul>
          {questions.map((q) => (
            <li key={q.questionId}>
              <strong>{q.title}</strong>
              <ul>
                {q.answers.map((ans) => (
                  <li key={ans.answerId}>
                    {ans.answerText} ({ans.skinType})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={() => toggleQuizStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/quiz/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quiz Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/quiz/add")}
        >
          Add New Quiz
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={
          quizs ? quizs.map((q, index) => ({ ...q, key: q.id || index })) : []
        }
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedQuiz(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete quiz{" "}
          <strong>{selectedQuiz?.title}</strong>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default QuizManagement;
