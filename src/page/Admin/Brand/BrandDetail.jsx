import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getBrandById } from "../../../service/brand/index";
import { toast } from "react-toastify";

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getBrandById(id);
        if (!response.error) {
          setBrand(response.result);
        } else {
          toast.error(response.message);
          navigate("/admin/brand");
        }
      } catch (error) {
        toast.error("Failed to fetch brand details");
        navigate("/admin/brand");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/brand")}
        className="mb-4"
      >
        Back to Brands
      </Button>

      <Card title="Brand Details">
        {brand && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <img
                src={brand.thumbnail}
                alt={brand.name}
                className="w-64 h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Brand Name
              </h3>
              <p className="text-gray-700 text-lg">{brand.name}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Description
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: brand.description }}
                className="prose prose-sm md:prose-base lg:prose-lg max-w-none [&>*]:text-center [&_p]:text-center [&_div]:text-center [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BrandDetail;
