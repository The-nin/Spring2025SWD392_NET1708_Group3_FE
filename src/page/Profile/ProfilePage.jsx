import { useState, useEffect } from "react";
import { FiEdit2, FiX } from "react-icons/fi";
import avatar from "../../assets/img/hero-photo.png";
import AddressBook from "../Profile/AddressBook/AddressBook.jsx";
import { div } from "framer-motion/client";
import AddNewAddress from "../Profile/AddressBook/AddNewAddress.jsx";
import Orders from "./MyOrders/MyOrdered.jsx";
import {
  getProfile,
  updateProfile,
  uploadToCloudinary,
} from "../../service/profile";
import React from "react";
import ConsultantHistory from "./ConsultantHistory/ConsultantHistory.jsx";

const EditModal = React.memo(
  ({ editFormData, onClose, onSubmit, onInputChange, onAvatarChange }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Edit information</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24 group">
                <img
                  src={
                    editFormData.avatar instanceof File
                      ? URL.createObjectURL(editFormData.avatar)
                      : editFormData.avatar || avatar
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <span className="text-white text-sm">Change Photo</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500">
                Click on the image to upload new photo
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={editFormData.firstName || ""}
                onChange={onInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editFormData.lastName || ""}
                onChange={onInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={editFormData.birthday || ""}
                onChange={onInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={editFormData.gender}
                onChange={onInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE",
    username: "",
    avatar: null,
    birthday: "",
  });
  const [formDataUpdate, setFormDataUpdate] = useState({
    firstName: "",
    lastName: "",
    gender: "MALE",
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE",
    username: "",
    avatar: null,
    birthday: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setEditFormData(formData);
  }, [formData]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getProfile();
      if (response.code === 200) {
        setFormData(response.result);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = editFormData.avatar;

      if (editFormData.avatar instanceof File) {
        try {
          const uploadResponse = await uploadToCloudinary(editFormData.avatar);
          if (uploadResponse) {
            avatarUrl = uploadResponse;
          }
        } catch (error) {
          console.error("Failed to upload image:", error);
          return;
        }
      }

      const updateData = {
        firstName: editFormData.firstName || "",
        lastName: editFormData.lastName || "",
        birthday:
          editFormData.birthday || new Date().toISOString().split("T")[0],
        gender: editFormData.gender || "MALE",
        avatar: avatarUrl,
      };

      const response = await updateProfile(updateData);
      if (response && response.code === 200) {
        await fetchProfile();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  return (
    <div className=" px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg border space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold mt-4">
                  {`${formData.firstName} ${formData.lastName}`}
                </h2>
                <p className="text-gray-500 text-sm">{formData.email}</p>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "profile"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Personal information
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "orders"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  My orders
                </button>
                <button
                  onClick={() => setActiveTab("consultant")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "consultant"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Consultant history
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "addresses"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Address book
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === "wishlist"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Favorite products
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg border">
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">
                      Personal information
                    </h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-gray-900 hover:text-gray-700"
                    >
                      <FiEdit2 className="mr-2" />
                      Edit
                    </button>
                  </div>

                  {!isLoading && (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-500 mb-1">Full name</p>
                        <p className="font-medium">
                          {`${formData.firstName || ""} ${
                            formData.lastName || ""
                          }`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Username</p>
                        <p className="font-medium">{formData.username}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Gender</p>
                        <p className="font-medium">{formData.gender}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">My orders</h3>
                  <Orders />
                  {/* Order history content */}
                </div>
              )}

              {activeTab === "consultant" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Consultant history
                  </h3>
                  <ConsultantHistory />
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Address book</h3>
                  <AddressBook />
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Favorite products
                  </h3>
                  {/* Wishlist content */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditModal
          editFormData={editFormData}
          onClose={() => setIsEditing(false)}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </div>
  );
};

export default ProfilePage;
