import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import { Edit, Trash } from "lucide-react";
import { CheckCircle2, RotateCcw } from "lucide-react";

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function SubTodos() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [subTodos, setSubTodos] = useState([]);
  const [formData, setFormData] = useState({
    taskName: "",
    comment: "",
    color: "#ffffff",
    textColor: "#000000",
  });
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchSubTodos = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URI}/subtodos/${slug}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      if (data.success) setSubTodos(data.tasks);
      else toast.info(data.message || "No subtodos found.");
    } catch (err) {
      toast.error("Failed to fetch subtodos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URI}/subtodos/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      toast.success("Deleted successfully");
      fetchSubTodos();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      taskName: todo.taskName,
      comment: todo.comment,
      color: todo.color,
      textColor: todo.textColor,
    });
  };

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URI}/subtodos/${todo._id}`,
        {
          ...todo,
          complete: !todo.complete,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      toast.success("Status updated");
      fetchSubTodos();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingTodo) {
        await axios.put(
          `${import.meta.env.VITE_API_URI}/subtodos/${editingTodo._id}`,
          { ...formData, slug },
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        toast.success("Updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URI}/create/sub-todo`,
          { ...formData, slug },
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        toast.success("Created successfully");
      }
      setFormData({
        taskName: "",
        comment: "",
        color: "#ffffff",
        textColor: "#000000",
      });
      setEditingTodo(null);
      fetchSubTodos();
    } catch (err) {
      toast.error("Failed to submit");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-emerald-100 py-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6 capitalize text-gray-800">
            {slug.replace(/-/g, " ")}
          </h2>

          {loading ? (
            <Spinner />
          ) : subTodos.length === 0 ? (
            <p className="text-gray-600">No subtodos found.</p>
          ) : (
            <ul className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-gray-100">
              {subTodos.map((todo) => (
                <li
                  key={todo._id}
                  className="p-4 shadow rounded-md border border-gray-200 transition-all duration-300"
                  style={{
                    backgroundColor: todo.complete
                      ? "#10B981"
                      : todo.color || "#f9f9f9",
                    color: todo.complete
                      ? "#ffffff"
                      : todo.textColor || "#000000",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{todo.taskName}</h3>
                      <p className="text-sm">{todo.comment}</p>
                      <p className="text-xs mt-1">
                        Created: {formatDateTime(todo.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        title={
                          todo.complete
                            ? "Mark as Incomplete"
                            : "Mark as Complete"
                        }
                        className={`p-2 rounded-full transition-all duration-200 ${
                          todo.complete
                            ? "bg-white text-emerald-600"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {todo.complete ? (
                          <RotateCcw size={18} />
                        ) : (
                          <CheckCircle2 size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => handleEdit(todo)}
                        title="Edit"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(todo._id)}
                        title="Delete"
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form */}
        <div className="mt-8 bg-white  shadow-md fixed bottom-0 left-0 w-full z-10 py-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4">
            <input
              type="text"
              value={formData.taskName}
              onChange={(e) =>
                setFormData({ ...formData, taskName: e.target.value })
              }
              placeholder="Enter task name"
              className="md:col-span-3 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="text"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Add a comment"
              className="md:col-span-3 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="md:col-span-2 flex items-center gap-2">
              <label className="text-sm font-medium">BG Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-10 h-10  cursor-pointer"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <label className="text-sm font-medium">Text Color</label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                className="w-10 h-10   cursor-pointer"
              />
            </div>

            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors duration-200"
              >
                {editingTodo ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SubTodos;
