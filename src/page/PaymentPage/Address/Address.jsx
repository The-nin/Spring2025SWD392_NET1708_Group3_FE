import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Total from "../Total";
import { getAddresses } from "../../../service/address";
import AddressModal from "./AddressModal";
import { addNewAddress, updateAddress } from "../../../service/address";

const Address = ({ onNext }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddresses();
        if (!response.error) {
          setAddresses(response.result);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddNewAddress = async (formData) => {
    try {
      const response = await addNewAddress(formData);
      if (!response.error) {
        // Refresh addresses list
        const addressesResponse = await getAddresses();
        if (!addressesResponse.error) {
          setAddresses(addressesResponse.result);
        }
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  const handleEditAddress = async (formData) => {
    try {
      const response = await updateAddress(editingAddress.id, formData);
      if (!response.error) {
        // Refresh addresses list
        const addressesResponse = await getAddresses();
        if (!addressesResponse.error) {
          setAddresses(addressesResponse.result);
        }
        setIsModalOpen(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleContinue = (cartId) => {
    if (selectedAddressId) {
      onNext(cartId, selectedAddressId);
    } else {
      alert("Vui lòng chọn địa chỉ giao hàng");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phần Address List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div>Loading addresses...</div>
          ) : addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className="border rounded-lg p-4 hover:border-gray-900 cursor-pointer"
              >
                <label
                  className="flex items-start space-x-4 cursor-pointer"
                  htmlFor={`address-${address.id}`}
                >
                  <input
                    type="radio"
                    id={`address-${address.id}`}
                    name="address"
                    value={address.id}
                    className="h-5 w-5 mt-1"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      console.log("Selected address ID:", value);
                      setSelectedAddressId(value);
                    }}
                    checked={selectedAddressId === address.id}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold text-lg">{address.name}</p>
                      <div className="space-x-4">
                        <button
                          className="text-gray-900 font-semibold"
                          onClick={(e) => {
                            e.preventDefault();
                            openEditModal(address);
                          }}
                        >
                          Edit
                        </button>
                        <button className="text-gray-900 font-semibold">
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{address.addressLine}</p>
                    <p className="text-gray-600 mt-1">
                      Contact - {address.phone}
                    </p>
                    {address.isDefault && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        DEFAULT
                      </span>
                    )}
                  </div>
                </label>
              </div>
            ))
          ) : (
            <div>No addresses found</div>
          )}

          {/* Add New Address Button */}
          <button
            className="flex items-center text-gray-900 mt-4"
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
          >
            <span className="text-xl mr-2">+</span>
            Add New Address
          </button>
        </div>

        <Total buttonText="Continue to Shipping" onNext={handleContinue} />
      </div>

      <AddressModal
        key={editingAddress ? editingAddress.id : "new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={editingAddress ? handleEditAddress : handleAddNewAddress}
        initialData={editingAddress}
      />
    </>
  );
};

Address.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Address;
