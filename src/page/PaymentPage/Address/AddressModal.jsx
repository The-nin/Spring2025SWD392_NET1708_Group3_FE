import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const AddressModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    default: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Ward</label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="default"
              checked={formData.default}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Set as default address</label>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              {initialData ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddressModal;
