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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deletingQuizId, setDeletingQuizId] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getAllQuizs(params.page, params.pageSize);

      if (!response.error) {
        let quizList = Array.isArray(response.result) ? response.result : [];

        quizList = quizList.filter((quiz) => !quiz.isDeleted);

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
      toast.error("Không hiện Bộ trắc nghiệm");
    } finally {
      setLoading(false);
    }
  };
  const getSkinTypeLabel = (skinType) => {
    const skinTypeMap = {
      DRY_SKIN: "Da Khô",
      SENSITIVE_SKIN: "Da Nhạy Cảm",
      OILY_SKIN: "Da Dầu",
      NORMAL_SKIN: "Da Thường",
      COMBINATION_SKIN: "Da Hỗn Hợp",
    };
    return skinTypeMap[skinType] || "Không xác định"; // Trả về "Không xác định" nếu không khớp
  };
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchQuizzes({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const toggleQuizStatus = async (quiz) => {
    try {
      setLoading(true);
      const newStatus = quiz.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateQuizStatus(quiz.id, newStatus);

      if (!response.error) {
        toast.success("Update Status thành công");
        setQuizzes((prevQuiz) =>
          prevQuiz.map((b) =>
            b.id === quiz.id ? { ...b, status: newStatus } : b
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Update bộ trắc nghiệm không thành công");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (quiz) => {
    setSelectedQuiz(quiz);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuiz) return;

    try {
      setLoading(true);
      const response = await deleteQuiz(selectedQuiz.id, { isDeleted: true });

      if (!response.error) {
        toast.success("Xóa bộ trắc nghiệm thành công");
        fetchQuizzes();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Xóa bộ trắc nghiệm thất bại");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setDeletingQuizId(null);
      setSelectedQuiz(null);
    }
  };

  const showViewModal = (quiz) => {
    setSelectedQuiz(quiz);
    setViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedQuiz(null);
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
      render: (status, record) => (
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
              <Tooltip title="Xem Chi Tiết">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => showViewModal(record)}
                />
              </Tooltip>
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
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Quản Lý Bộ Trắc Nghiệm</h2>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/quiz/add")}
        >
          Thêm Bộ Trắc Nghiệm Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quizzes}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* Modal Xem Chi Tiết Quiz */}
      <Modal
        title="Chi Tiết Bộ trắc nghiệm"
        open={viewModalVisible}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
      >
        {selectedQuiz && (
          <div>
            <p>
              <strong>ID:</strong> {selectedQuiz.id}
            </p>
            <p>
              <strong>Tiêu Đề:</strong> {selectedQuiz.title}
            </p>
            <p>
              <strong>Mô Tả:</strong> {selectedQuiz.description}
            </p>
            <p>
              <strong>Trạng Thái:</strong>{" "}
              {selectedQuiz.status === "ACTIVE"
                ? "Hoạt động"
                : "Không hoạt động"}
            </p>

            {/* Hiển thị danh sách câu hỏi */}
            <h3 className="mt-4">Danh Sách Câu Hỏi:</h3>
            {selectedQuiz.question && selectedQuiz.question.length > 0 ? (
              selectedQuiz.question.map((q, index) => (
                <div key={q.questionId} className="border p-3 mt-2">
                  <p>
                    <strong>Câu Hỏi {index + 1}:</strong> {q.title}
                  </p>

                  {/* Hiển thị danh sách câu trả lời */}
                  <h4>Danh Sách Đáp Án:</h4>
                  {q.answers && q.answers.length > 0 ? (
                    <ul>
                      {q.answers.map((a) => (
                        <li key={a.answerId}>
                          <strong>•</strong> {a.answerText}{" "}
                          {a.skinType && (
                            <span
                              style={{ fontStyle: "italic", color: "gray" }}
                            >
                              (Loại da: {getSkinTypeLabel(a.skinType)})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Không có đáp án</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có câu hỏi</p>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="Xác Nhận Xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedQuiz(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa bộ trắc nghiệm "{selectedQuiz?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default QuizManagement;
