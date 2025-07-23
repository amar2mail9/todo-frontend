import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import { Edit, Plus, PlusCircle, Trash } from "lucide-react";
import { formatDateTime } from "../utils/formatDateTime";
import Spinner from "../Spinner";

function Home() {
  const [mainTodos, setMainTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    color: "#ffffff",
    textColor: "#000000",
    _id: "",
  });

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URI}/main-todos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setMainTodos(data.data || []);
      } else {
        toast.error(data.error || "Failed to fetch todos");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (todo) => {
    setEditForm(todo);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/main-todo/${editForm._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            title: editForm.title,
            color: editForm.color,
            textColor: editForm.textColor,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Todo updated");
        setEditOpen(false);
        fetchTodos();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const deleteTodo = async (id) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/main-todo/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Todo deleted");
        fetchTodos();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Layout>
      <div className="px-[5%] py-20 min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-emerald-700">Your Todos</h2>

        {loading ? (
          <Spinner />
        ) : mainTodos.length === 0 ? (
          <div className="text-gray-500 text-lg text-center mt-10">
            🎯 No todos found. Start by creating one!
            <div className="flex justify-center">
              <Link to={"/create"}>
                <button className="flex items-center justify-center  gap-2 bg-emerald-600 text-white py-2 px-4 rounded-4xl">
                  <PlusCircle /> Add Task
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {mainTodos.map((todo) => (
              <Link to={`/${todo.slug}`} key={todo._id}>
                <div
                  className="rounded-xl shadow-md p-5 transition-all hover:scale-[1.02] duration-300 border"
                  style={{ background: todo.color, color: todo.textColor }}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-[80%]">
                      <h3 className="text-xl capitalize font-bold">
                        {todo.title}
                      </h3>
                      <p className="text-sm mt-2 opacity-75">
                        Created: {formatDateTime(todo.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openEditModal(todo);
                        }}
                        title="Edit"
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTodo(todo._id);
                        }}
                        title="Delete"
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {editOpen && (
          <div className="fixed inset-0 bg-[#1a5e3a71] bg-opacity-50 flex justify-center items-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-700">
                Edit Todo
              </h3>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full mb-3 p-2 border rounded-md"
                placeholder="Title"
                required
              />
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm">Background</label>
                  <input
                    type="color"
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm({ ...editForm, color: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm">Text</label>
                  <input
                    type="color"
                    value={editForm.textColor}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        textColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
