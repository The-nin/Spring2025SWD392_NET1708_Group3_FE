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
export const getUserBlogs = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get("/blog", {
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
export const getBlogById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`/blog/${id}`, {
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
export const uploadToCloudinary = async (file) => {
  try {
    const CLOUDINARY_UPLOAD_PRESET = "phuocnt-cloudinary";
    const CLOUDINARY_CLOUD_NAME = "dl5dphe0f";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export const addBlog = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    // Ensure formData is a FormData object
    const requestData =
      formData instanceof FormData
        ? JSON.parse(formData.get("request"))
        : formData;

    const file =
      formData instanceof FormData ? formData.get("image") : formData.image;

    // Upload image if available
    let imageUrl = requestData.image;
    if (file) {
      imageUrl = await uploadToCloudinary(file);
    }

    // Final blog data
    const blogData = {
      ...requestData,
      image: imageUrl,
    };
    console.log(blogData);
    const response = await instance.post("admin/blog", blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Add blog error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to add blog",
    };
  }
};

export const updateBlog = async (blogId, blogData, imageFile) => {
  const token = localStorage.getItem("token");

  try {
    let imageUrl = blogData.image;

    // Upload new image if provided and it's actually a file
    if (imageFile && imageFile instanceof File) {
      try {
        imageUrl = await uploadToCloudinary(imageFile);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Failed to upload image:", uploadError);
        return {
          error: true,
          message: "Failed to upload image to Cloudinary",
        };
      }
    }

    // Prepare updated blog data - only include necessary fields
    const updatedBlogData = {
      blogName: blogData.blogName,
      description: blogData.description,
      content: blogData.content,
      createdBy: blogData.createdBy,
      date: blogData.date,
      image: imageUrl,
      status: blogData.status || "ACTIVE",
    };
    // Log request data for debugging
    console.log("Sending blog update request:", {
      url: `admin/blog/${blogId}`,
      data: updatedBlogData,
    });

    // Send the updated blog data to the server
    const response = await instance.put(
      `admin/blog/${blogId}`,
      updatedBlogData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    // Enhanced error logging
    console.error("Update blog error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      serverMessage: error.response?.data?.message,
      errorData: error.response?.data,
      blogId,
      requestData: blogData,
    });

    return {
      error: true,
      message: error.response?.message || "Failed to update blog",
    };
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
