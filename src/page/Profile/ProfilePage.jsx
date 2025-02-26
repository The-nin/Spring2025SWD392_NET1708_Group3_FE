import { useState } from "react";
import { FiEdit2, FiX } from "react-icons/fi";
import avatar from "../../assets/img/hero-photo.png";
import AddressBook from "../Profile/AddressBook/AddressBook.jsx";
import { div } from "framer-motion/client";
import AddNewAddress from "../Profile/AddressBook/AddNewAddress.jsx";
import Orders from "./MyOrders/MyOrdered.jsx";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+84 123 456 789",
    birthDate: "1990-01-01",
    gender: "Nam",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý cập nhật thông tin
    setIsEditing(false);
  };

  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit information</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Date of birth</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            >
              <option value="Nam">Male</option>
              <option value="Nữ">Female</option>
              <option value="Khác">Other</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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

  return (
    <div className=" px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg border space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold mt-4">John Doe</h2>
                <p className="text-gray-500 text-sm">john.doe@example.com</p>
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

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 mb-1">Full name</p>
                      <p className="font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Phone number</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Date of birth</p>
                      <p className="font-medium">{formData.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Gender</p>
                      <p className="font-medium">{formData.gender}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">My orders</h3>
                  <Orders />
                  {/* Order history content */}
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

      {isEditing && <EditModal />}
    </div>
  );
};

export default ProfilePage;
