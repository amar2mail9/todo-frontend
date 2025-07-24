import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Edit, PlusCircle, Trash, ClipboardList } from "lucide-react";
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

  const user = JSON.parse(Cookies.get("user") || "{}");

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
      if (data.success) setMainTodos(data.data || []);
      else toast.error(data.error || "Failed to fetch todos");
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
          body: JSON.stringify(editForm),
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
    } catch {
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
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Layout>
      <div className="px-[5%] py-20 min-h-screen bg-emerald-50">
        {/* Welcome Heading */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-emerald-700">
            <ClipboardList className="w-6 h-6" />
            Welcome back,{" "}
            <span className="capitalize">{user.fullname?.toLowerCase()}</span>
          </h2>
        </div>

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : mainTodos.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg mb-4">
              🎯 No todos found. Start by creating one!
            </p>
            <Link to="/create">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Add Task
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {mainTodos.map((todo) => (
              <Link to={`/${todo.slug}`} key={todo._id}>
                <div
                  className="rounded-xl p-5 shadow-md transition-transform hover:scale-105 duration-300  overflow-hidden"
                  style={{ background: todo.color, color: todo.textColor }}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-[80%]">
                      <h3 className="text-xl font-bold truncate capitalize">
                        {todo.title}
                      </h3>
                      <p className="text-sm mt-2 opacity-80">
                        Created: {formatDateTime(todo.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openEditModal(todo);
                        }}
                        className="bg-white/20 hover:bg-white/30 p-1 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTodo(todo._id);
                        }}
                        className="bg-white/20 hover:bg-white/30 p-1 rounded"
                        title="Delete"
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

        {/* Edit Modal */}
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
                className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Title"
                required
              />
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="text-sm block mb-1">Background</label>
                  <input
                    type="color"
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm({ ...editForm, color: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Text</label>
                  <input
                    type="color"
                    value={editForm.textColor}
                    onChange={(e) =>
                      setEditForm({ ...editForm, textColor: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
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
