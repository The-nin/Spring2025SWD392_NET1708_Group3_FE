import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getCategoryById } from "../../../service/category/index";
import { toast } from "react-toastify";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(id);
        if (!response.error) {
          setCategory(response.result);
        } else {
          toast.error(response.message);
          navigate("/admin/category");
        }
      } catch (error) {
        toast.error("Failed to fetch category details");
        navigate("/admin/category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
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
        onClick={() => navigate("/admin/category")}
        className="mb-4"
      >
        Back to Categories
      </Button>
      <Card title="Category Details">
        {category && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <img
                src={category.thumbnail}
                alt={category.name}
                className="w-64 h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Category Name
              </h3>
              <p className="text-gray-700 text-lg">{category.name}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Description
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: category.description }}
                className="prose prose-sm md:prose-base lg:prose-lg max-w-none [&>*]:text-center [&_p]:text-center [&_div]:text-center [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CategoryDetail;
