import { useState } from "react";

const AddNewAddress = ({ onClose, defaultValues, onAddAddress }) => {
  const [form, setForm] = useState(
    defaultValues || {
      name: "",
      phone: "",
      city: "",
      district: "",
      ward: "",
      street: "",
      default: false,
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name || form.name.length < 2 || form.name.length > 50) {
      newErrors.name = "Độ dài phải từ 2 đến 50 ký tự.";
    }
    const phoneRegex = /^[0-9]{8,10}$/;
    if (!form.phone) {
      newErrors.phone = "Thông tin bắt buộc.";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone =
        "Thông tin vừa nhập không hợp lệ. Vui lòng kiểm tra lại.";
    }
    if (!form.city) newErrors.city = "Thông tin bắt buộc.";
    if (!form.district) newErrors.district = "Thông tin bắt buộc.";
    if (!form.ward) newErrors.ward = "Thông tin bắt buộc.";
    if (!form.street) newErrors.street = "Thông tin bắt buộc.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddAddress(form);
      onClose();
    }
  };

  return (
    <div className="p-6 bg-white w-full max-w-full border rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Họ tên:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Tỉnh/Thành phố:</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Quận/Huyện:</label>
          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Phường/Xã:</label>
          <input
            type="text"
            name="ward"
            value={form.ward}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Địa chỉ cụ thể:</label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street}</p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-1">
          <input
            id="defaultAddress"
            type="checkbox"
            name="default"
            checked={form.default}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="defaultAddress" className="text-sm cursor-pointer">
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-400 hover:bg-neutral-900 text-white rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-900 text-white rounded"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAddress;
