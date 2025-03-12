import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import AddNewAddress from "./AddNewAddress";
import {
  addNewAddress,
  getAddresses,
  updateAddress,
  setDefaultAddress,
} from "../../../service/address";
import { toast } from "react-toastify";

const AddressBook = () => {
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [locationData, setLocationData] = useState({
    cities: [],
    districts: {},
    wards: {},
  });

  // Add this useEffect to fetch addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, []); // Empty dependency array means this runs once when component mounts

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAddresses();
      if (response.code !== 200) {
        console.error("Error fetching addresses:", response.message);
        return;
      }
      setAddresses(response.result || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleEdit = (addr) => {
    setEditForm(addr);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditForm(null);
  };

  const handleAddAddress = async (formData) => {
    try {
      const response = await addNewAddress(formData);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success("Address added successfully!");
      fetchAddresses(); // Refresh the addresses list
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleUpdateAddAddress = async (updatedAddress) => {
    try {
      const response = await updateAddress(updatedAddress.id, updatedAddress);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success("Address updated successfully!");
      fetchAddresses(); // Refresh the addresses list
      handleCloseForm();
    } catch (error) {
      toast.error("Failed to update address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await setDefaultAddress(addressId);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success("Default address updated successfully!");
      fetchAddresses(); // Refresh the addresses list
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  return (
    <div className="p-6 bg-white w-full max-w-full">
      {showForm ? (
        <AddNewAddress
          onClose={handleCloseForm}
          defaultValues={editForm}
          onAddAddress={editForm ? handleUpdateAddAddress : handleAddAddress}
        />
      ) : (
        <>
          <div className="border rounded-md p-4 bg-gray-50">
            {loading ? (
              <div className="text-center py-4">Đang tải địa chỉ...</div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-4">Không tìm thấy địa chỉ nào</div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border-b last:border-0 p-4 flex justify-between items-start"
                >
                  <div className="w-full max-w-[60%]">
                    <p className="font-semibold text-gray-800 flex items-center gap-1">
                      {addr.name} - {addr.phone}
                      {addr.isDefault && (
                        <span className="text-sky-900 font-medium">
                          {" "}
                          - Địa chỉ mặc định
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {!addr.isDefault && (
                      <button
                        className="text-sky-600 font-medium hover:underline"
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Đặt làm mặc định
                      </button>
                    )}
                    <button
                      className="text-neutral-600 font-medium hover:underline"
                      onClick={() => handleEdit(addr)}
                    >
                      Sửa
                    </button>
                    {addresses.length > 1 && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(addr.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 px-0 flex items-center justify-end w-full">
            <p className="text-gray-700 px-2">
              Bạn muốn giao hàng đến địa chỉ khác?
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-900"
            >
              Thêm địa chỉ mới
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddressBook;
