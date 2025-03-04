import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.data?.message || defaultMessage,
  };
};

// ✅ Fetch all blogs (Admin Access Required)
export const getAllBlogs = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get("/admin/blog", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch blogs");
  }
};

// ✅ Fetch blog details by ID (Admin Access Required)
export const getBlogById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`/admin/blog/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch blog details");
  }
};

// ✅ Add a new blog (Admin Access Required) - No File Upload
export const addBlog = async (blogData) => {
  const token = localStorage.getItem("token");

  try {
    console.log("📤 Sending Blog Data:", JSON.stringify(blogData, null, 2)); // ✅ Logs the request body

    const response = await instance.post("/admin/blog", blogData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ API Response:", response.data); // ✅ Logs the response if successful

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("❌ Error Response:", error.response?.data || error.message);
    return handleError(error, "Failed to add blog");
  }
};

// ✅ Update an existing blog (Admin Access Required) - No File Upload
export const updateBlog = async (id, blogData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.put(`/admin/blog/${id} `, blogData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to update blog");
  }
};

// ✅ Delete a blog (Admin Access Required)
export const deleteBlog = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.delete(`/admin/blog/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to delete blog");
  }
};

// ✅ Update blog status (Admin Access Required)
export const updateBlogStatus = async (blogId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(
      `/admin/blog/${blogId}?status=${status}`, // Corrected API endpoint
      { status }, // Send status in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      error: false,
      result: response.data?.result, // Ensure correct response data
      message: response.data?.message,
    };
  } catch (error) {
    console.error("Update blog status error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update blog status",
    };
  }
};
