import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const AddMainTodo = () => {
  const [title, setTitle] = useState("");
  const [bgColor, setBgColor] = useState("#10b981");
  const [textColor, setTextColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URI}/create/main-todo`,
        { title, color: bgColor, textColor },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success("Todo added!");
        setTitle("");
        navigate("/");
      } else {
        toast.error("Failed to add todo");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gray-50 flex justify-center items-center px-4">
        <div className="w-full max-w-lg bg-white border border-gray-200 shadow-md rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-emerald-600 mb-8">
            Create New Main Todo
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Todo Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Learn React, Project Planning"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Todo"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddMainTodo;
