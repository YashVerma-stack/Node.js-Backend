import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tasks
  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch tasks");
      }

      setTasks(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create task");
      }

      setTasks((currentTasks) => [...currentTasks, result.data]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Toggle Completed/Pending
  async function toggleTask(task) {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? result.data : currentTask
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Start editing a task
  function startEdit(task) {
    setEditId(task.id);
    setEditTitle(task.title);
    setError("");
  }

  // Cancel editing
  function cancelEdit() {
    setEditId(null);
    setEditTitle("");
  }

  // Save edited task
  async function saveEdit(taskId) {
    if (!editTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to edit task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? result.data : task
        )
      );

      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete a task
  async function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );

      if (editId === taskId) {
        cancelEdit();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          My Todo App
        </h1>

        {/* Create task form */}
        <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </p>
        )}

        {/* Task list */}
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">
            No tasks found. Add your first task!
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                {editId === task.id ? (
                  /* Edit mode */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveEdit(task.id);
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      autoFocus
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  /* Normal mode */
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2
                        className={`break-words font-semibold ${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Status: {task.completed ? "Completed" : "Pending"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleTask(task)}
                        className={`rounded-lg px-3 py-2 text-sm text-white ${
                          task.completed
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {task.completed ? "Mark Pending" : "Complete"}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEdit(task)}
                        className="rounded-lg bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-sm text-gray-500">
          Total tasks: {tasks.length}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Completed: {tasks.filter((task) => task.completed).length}
          {" | "}
          Pending: {tasks.filter((task) => !task.completed).length}
        </p>
      </div>
    </main>
  );
}

export default App;
