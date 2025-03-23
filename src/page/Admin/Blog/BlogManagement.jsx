import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Switch } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined, // 👁️ View Icon
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getAllBlogs,
  deleteBlog,
  updateBlogStatus,
} from "../../../service/blog/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false); // 👁️ View modal state
  const [deletingBlogId, setDeletingBlogId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false); // ✅ State để ẩn/hiện blog đã xóa

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogs();

      if (!response.error) {
        const sortedBlogs = response.result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBlogs(sortedBlogs);
        setPagination((prev) => ({
          ...prev,
          total: sortedBlogs.length,
        }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không thể tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchBlogs({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const showDeleteConfirm = (blog) => {
    setSelectedBlog(blog);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;

    try {
      setDeletingBlogId(selectedBlog.id);
      const response = await deleteBlog(selectedBlog.id);

      if (!response.error) {
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== selectedBlog.id)
        );
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
        toast.success("Đã xóa bài viết thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không xóa được bài viết");
    } finally {
      setDeletingBlogId(null);
      setDeleteModalVisible(false);
      setSelectedBlog(null);
    }
  };

  const toggleBlogStatus = async (blog) => {
    try {
      setLoading(true);
      const newStatus = blog.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await updateBlogStatus(blog.id, newStatus);

      if (!response.error) {
        toast.success("Trạng thái bài viết đã được cập nhật thành công!");
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b.id === blog.id ? { ...b, status: newStatus } : b
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không cập nhật được trạng thái bài viết");
    } finally {
      setLoading(false);
    }
  };

  // Show View Modal
  const showViewModal = (blog) => {
    setSelectedBlog(blog);
    setViewModalVisible(true);
  };

  // ✅ Lọc danh sách blogs hiển thị theo trạng thái "isDeleted"
  const filteredBlogs = showDeleted
    ? blogs
    : blogs.filter((blog) => !blog.isDeleted);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Blog"
            className="w-16 h-16 object-cover rounded"
            onError={(e) => (e.target.src = "/fallback-image.jpg")} // Ảnh mặc định nếu bị lỗi
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },

    {
      title: "Tên bài viết",
      dataIndex: "blogName",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) =>
        showDeleted ? (
          <span>{status}</span> // Chỉ hiển thị text nếu là blog đã xóa
        ) : (
          <Switch
            checked={status === "ACTIVE"}
            onChange={() => toggleBlogStatus(record)}
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        ),
    },
  ];

  // Nếu đang xem blog đã xóa, loại bỏ cột "Hành động"
  if (!showDeleted) {
    columns.push({
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          {deletingBlogId === record.id ? (
            <LoadingOutlined style={{ fontSize: 20 }} />
          ) : (
            <>
              <Tooltip title="View">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => showViewModal(record)}
                />
              </Tooltip>
              <Tooltip title="Edit">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/admin/blog/edit/${record.id}`)}
                />
              </Tooltip>
              <Tooltip title="Delete">
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
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Quản Lý bài viết</h2>
      <div className="flex justify-end items-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/blog/add")}
        >
          Thêm Bài Viết Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBlogs}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* Modal Xem Chi Tiết Blog */}
      <Modal
        title="Chi Tiết bài viết"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedBlog && (
          <div>
            <img
              src={selectedBlog.image}
              alt="Blog"
              className="w-full h-60 object-cover mb-4 rounded"
            />
            <h3 className="text-xl font-semibold mb-3">
              {selectedBlog.blogName}
            </h3>
            <p className="text-gray-500 italic mb-3">
              Tác giả:{" "}
              <span className="font-medium">{selectedBlog.author}</span>
            </p>
            <p className="  mb-3">
              <p className="text-gray-500 italic mb-3">
                Ngày đăng:{" "}
                <span className="font-medium">
                  {new Date(selectedBlog.date).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </p>
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Miêu tả:</h4>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedBlog.description}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Xác Nhận Xóa */}
      <Modal
        title="Xác Nhận Xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedBlog(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết "{selectedBlog?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default BlogManagement;
