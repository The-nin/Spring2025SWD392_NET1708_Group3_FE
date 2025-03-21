import { useState, useEffect } from "react";
import {
  getMyVouchers,
  getAvailableVouchers,
  exchangeVoucher,
} from "../../../service/voucher";
import { toast } from "react-hot-toast";

const ExchangeVoucherModal = ({
  isOpen,
  onClose,
  availableVouchers,
  userPoints,
  onExchange,
}) => {
  const [errorMessages, setErrorMessages] = useState({});

  if (!isOpen) return null;

  const handleExchange = async (voucher) => {
    try {
      await onExchange(voucher);
      setErrorMessages((prev) => ({ ...prev, [voucher.id]: null }));
    } catch (error) {
      const errorMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Có lỗi xảy ra khi đổi voucher";
      setErrorMessages((prev) => ({ ...prev, [voucher.id]: errorMessage }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Đổi Voucher</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {availableVouchers.length > 0 ? (
            <div className="grid gap-4">
              {availableVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="border rounded-lg p-4 flex flex-col"
                >
                  {errorMessages[voucher.id] && (
                    <p className="text-red-500 text-sm mb-2">
                      {errorMessages[voucher.id]}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{voucher.code}</h4>
                      <p className="text-sm text-gray-600">
                        {voucher.description}
                      </p>
                      <div className="mt-1">
                        <span className="text-sm text-gray-600">
                          Giảm:{" "}
                          {voucher.discountType === "PERCENTAGE"
                            ? `${voucher.discount}%`
                            : `${voucher.discount.toLocaleString("vi-VN")}đ`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {voucher.point} điểm
                      </p>
                      <button
                        onClick={() => handleExchange(voucher)}
                        disabled={userPoints < voucher.point}
                        className={`mt-2 px-4 py-2 rounded-lg text-sm ${
                          userPoints >= voucher.point
                            ? "bg-gray-900 text-white hover:bg-gray-700"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {userPoints >= voucher.point
                          ? "Đổi ngay"
                          : "Không đủ điểm"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Không có voucher nào khả dụng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MyVoucher = ({ userPoints }) => {
  const [vouchers, setVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [vouchersResponse, availableVouchersResponse] = await Promise.all([
        getMyVouchers(),
        getAvailableVouchers(),
      ]);

      if (vouchersResponse.code === 200) {
        setVouchers(vouchersResponse.result.content);
      }

      if (availableVouchersResponse.code === 200) {
        setAvailableVouchers(availableVouchersResponse.result.content);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExchangeVoucher = async (voucher) => {
    try {
      const response = await exchangeVoucher(voucher.id);
      if (response.code === 200) {
        toast.success("Đổi voucher thành công!");
        fetchData();
        setIsExchangeModalOpen(false);
      }
    } catch (error) {
      console.log("Error response data:", error.response?.data);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  return (
    <div className="space-y-0">
      {/* Points Section */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Điểm tích lũy của bạn
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {userPoints}
              </span>
              <span className="text-gray-600">điểm</span>
            </div>
          </div>
          <button
            onClick={() => setIsExchangeModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            Đổi Voucher
          </button>
        </div>
      </div>

      {/* Vouchers Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Voucher của bạn</h3>
        {vouchers.length > 0 ? (
          <div className="grid gap-4">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white p-4 rounded-lg border hover:border-gray-900 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{voucher.code}</h4>
                    <p className="text-gray-600">{voucher.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        Giảm:{" "}
                        <span className="font-medium text-gray-900">
                          {voucher.discount.toLocaleString("vi-VN")}đ
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Đơn tối thiểu:{" "}
                        <span className="font-medium text-gray-900">
                          {voucher.minOrderValue.toLocaleString("vi-VN")}đ
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Bạn chưa có voucher nào</p>
          </div>
        )}
      </div>

      {/* Exchange Modal */}
      <ExchangeVoucherModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        availableVouchers={availableVouchers}
        userPoints={userPoints}
        onExchange={handleExchangeVoucher}
      />
    </div>
  );
};

export default MyVoucher;
