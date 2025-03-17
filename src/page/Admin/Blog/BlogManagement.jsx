import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Switch } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined, // 👁️ Added View Icon
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
      toast.error("Không thể tải blog");
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
        toast.success("Đã xóa blog thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không xóa được blog");
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
        toast.success("Trạng thái blog đã được cập nhật thành công!");
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b.id === blog.id ? { ...b, status: newStatus } : b
          )
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không cập nhật được trạng thái blog");
    } finally {
      setLoading(false);
    }
  };

  // Show View Modal
  const showViewModal = (blog) => {
    setSelectedBlog(blog);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="blog"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Tên Blog",
      dataIndex: "blogName",
      key: "name",
    },
    {
      title: "Miêu tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={() => toggleBlogStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
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
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản Lý Blog</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/blog/add")}
        >
          Thêm Blog Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* Modal Xem Chi Tiết Blog */}
      <Modal
        title="Chi Tiết Blog"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedBlog && (
          <div>
            <img
              src={selectedBlog.thumbnail}
              alt="Blog"
              className="w-full h-60 object-cover mb-4 rounded"
            />
            <h3 className="text-xl font-semibold">{selectedBlog.name}</h3>
            <p className="text-gray-600">{selectedBlog.description}</p>
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
        <p>Bạn có chắc chắn muốn xóa blog "{selectedBlog?.name}"?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default BlogManagement;
