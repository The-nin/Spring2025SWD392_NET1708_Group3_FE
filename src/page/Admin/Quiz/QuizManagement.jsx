import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Tag, Switch } from "antd";
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
  const [loading, setLoading] = useState(false);
  const [quizs, setQuizs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchQuizs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllQuizs({
        page: params.page - 1 || 0,
        size: params.pageSize || 10,
      });

      if (!response.error) {
        setQuizs(response.result.quizResponses);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch quizs", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizs();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchQuizs({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const showDeleteConfirm = (quiz) => {
    setSelectedQuiz(quiz);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuiz) return;

    try {
      setLoading(true);
      const response = await deleteQuiz(selectedQuiz.id);

      if (!response.error) {
        await fetchQuizs({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        toast.success("Quiz deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete quiz", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedQuiz(null);
    }
  };

  const toggleQuizStatus = async (quiz) => {
    try {
      setLoading(true);
      const newStatus = quiz.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateQuizStatus(quiz.id, newStatus);
      if (!response.error) {
        toast.success("Quiz status updated successfully!");
        fetchQuizs({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update quiz status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "name",
      key: "name",
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
        dataSource={quizs}
        rowKey="id"
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
          Are you sure you want to delete quiz `&quot;`{selectedQuiz?.name}
          `&quot;`?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default QuizManagement;
