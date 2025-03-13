import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Switch } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
  const [quizzes, setQuizzes] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState(null);

  // ✅ Fetch quizzes (excluding deleted ones unless toggled)
  const fetchQuizzes = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllQuizs(params.page, params.pageSize);

      if (!response.error) {
        let quizList = Array.isArray(response.result) ? response.result : [];

        if (!showDeleted) {
          quizList = quizList.filter((quiz) => !quiz.isDeleted);
        }

        setQuizzes(quizList);
        setPagination((prev) => ({
          ...prev,
          current: params.page || prev.current,
          pageSize: params.pageSize || prev.pageSize,
          total: quizList.length,
        }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [showDeleted]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchQuizzes({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const showDeleteConfirm = (quiz) => {
    setSelectedQuiz(quiz);
    setDeleteModalVisible(true);
  };

  // ✅ Soft delete quiz (set isDeleted: true)
  const handleDeleteConfirm = async () => {
    if (!selectedQuiz) return;

    try {
      setDeletingQuizId(selectedQuiz.id);
      const response = await deleteQuiz(selectedQuiz.id, { isDeleted: true });

      if (!response.error) {
        toast.success("Quiz deleted successfully!");
        fetchQuizzes();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete quiz");
    } finally {
      setDeletingQuizId(null);
      setDeleteModalVisible(false);
      setSelectedQuiz(null);
    }
  };

  // ✅ Restore quiz (set isDeleted: false)
  const handleRestoreQuiz = async (quiz) => {
    try {
      setLoading(true);
      const response = await deleteQuiz(quiz.id, { isDeleted: false });

      if (!response.error) {
        toast.success("Quiz restored successfully!");
        fetchQuizzes();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to restore quiz");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuizStatus = async (quiz) => {
    try {
      setLoading(true);
      const newStatus = quiz.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateQuizStatus(quiz.id, newStatus);

      if (!response.error) {
        toast.success("Quiz status updated successfully!");
        fetchQuizzes();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update quiz status");
    } finally {
      setLoading(false);
    }
  };

  const showViewModal = (quiz) => {
    setSelectedQuiz(quiz);
    setViewModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id },
    { title: "Tiêu Đề", dataIndex: "title", key: "title" },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        !record.isDeleted && (
          <Switch
            checked={status === "ACTIVE"}
            onChange={() => toggleQuizStatus(record)}
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        ),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space>
          {deletingQuizId === record.id ? (
            <LoadingOutlined style={{ fontSize: 20 }} />
          ) : (
            <>
              {!record.isDeleted ? (
                <>
                  <Tooltip title="Chỉnh Sửa">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/admin/quiz/edit/${record.id}`)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(record)}
                    />
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Khôi Phục">
                  <Button
                    type="default"
                    icon={<UndoOutlined />}
                    onClick={() => handleRestoreQuiz(record)}
                  />
                </Tooltip>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản Lý Quiz</h2>
        <div>
          <Switch
            checked={showDeleted}
            onChange={() => setShowDeleted((prev) => !prev)}
            checkedChildren="Hiện Quiz Đã Xóa"
            unCheckedChildren="Ẩn Quiz Đã Xóa"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/quiz/add")}
            className="ml-4"
          >
            Thêm Quiz Mới
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={quizzes}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title="Xác Nhận Xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa quiz "{selectedQuiz?.title}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default QuizManagement;
