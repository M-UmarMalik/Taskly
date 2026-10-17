import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Check, Pencil, Play, Plus, Search, Trash2, Undo2 } from "lucide-react";
import DashLayout from "../components/DashLayout";
import NewTask from "../components/Task.jsx";
import EditTask from "../components/EditTask.jsx";

const API_URL = import.meta.env.VITE_API_URL;
// Updated to match your Mongoose schema exact enum values: ['In progress', 'Completed', 'ToDo']
const STATUS = { TODO: "ToDo", PROGRESS: "In progress", DONE: "Completed" };

// Labels shown on screen
const STATUS_LABEL = { todo: "ToDo", progress: "In progress", done: "Completed" };

// Status filter options: [key, label]
const STATUS_FILTERS = [
  ["todo", STATUS_LABEL.todo],
  ["progress", STATUS_LABEL.progress],
  ["done", STATUS_LABEL.done],
];

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const CATEGORY_OPTIONS = ["Work", "Study", "Finance", "Health", "Personal"];

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getId = (task) => task._id || task.id;

// Turns any variant into the exact value the backend expects.
const normalizeStatus = (value) => {
  const s = String(value || "").toLowerCase().replace(/[\s_-]/g, "");
  if (s === "completed" || s === "done") return STATUS.DONE;
  if (s === "inprogress") return STATUS.PROGRESS;
  return STATUS.TODO;
};

// Backend status  ->  "todo" | "progress" | "done"
const statusKey = (status) => {
  const s = normalizeStatus(status);
  if (s === STATUS.DONE) return "done";
  if (s === STATUS.PROGRESS) return "progress";
  return "todo";
};

// To Do -> In Progress -> Completed -> (reopen) To Do
const NEXT_STATUS = { todo: STATUS.PROGRESS, progress: STATUS.DONE, done: STATUS.TODO };

const ADVANCE_BUTTON = {
  todo: { Icon: Play, label: "Start task", main: false },
  progress: { Icon: Check, label: "Mark completed", main: true },
  done: { Icon: Undo2, label: "Reopen task", main: false },
};

/* ---------- styles (CSS variables, works in light and dark) ---------- */

const text = { color: "var(--text-color)" };
const muted = { color: "var(--muted-text)" };
const panel = {
  backgroundColor: "var(--card-bg)",
  borderColor: "var(--border-color)",
};

const FIELD =
  "w-full rounded-[14px] border border-[color:var(--border-color)] bg-[color:var(--chip-bg)] px-3.5 py-2.5 text-sm text-[color:var(--text-color)] outline-none transition focus:border-[color:var(--accent-color)]";

const ICON_BTN =
  "grid h-[34px] w-[34px] place-items-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--chip-bg)] text-[color:var(--text-color)] transition hover:border-[color:var(--accent-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-color)]";

const PRIORITY_STYLE = {
  high: { backgroundColor: "var(--bad-bg)", color: "var(--bad)" },
  medium: { backgroundColor: "var(--warn-bg)", color: "var(--warn)" },
  low: { backgroundColor: "var(--ok-bg)", color: "var(--ok)" },
};

const STATUS_STYLE = {
  todo: {
    backgroundColor: "var(--chip-bg)",
    color: "var(--muted-text)",
    border: "1px solid var(--border-color)",
  },
  progress: { backgroundColor: "var(--accent-soft)", color: "var(--accent-text)" },
  done: { backgroundColor: "var(--ok-bg)", color: "var(--ok)" },
};

const Pill = ({ style, children }) => (
  <span
    className="inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
    style={style}
  >
    {children}
  </span>
);

/* ---------- page ---------- */

const Tasks = ({ isDark, toggleTheme }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  // Filters ("" means all). statusFilter holds "todo" | "progress" | "done".
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Close the delete dialog with Escape
  useEffect(() => {
    if (!deleteTarget) return undefined;
    const onKey = (e) => e.key === "Escape" && setDeleteTarget(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteTarget]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL, getAuthConfig());
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.tasks || [];
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data || error.message);
        setLoadError("Could not load your tasks. Check that the server is running and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Create
  const handleCreate = async (newTaskData) => {
    try {
      const response = await axios.post(
        API_URL,
        { ...newTaskData, status: newTaskData.status || "ToDo" },
        getAuthConfig()
      );
      const created = response.data?.task || response.data;
      setTasks((prev) => [...prev, created]);
      setShowTaskForm(false);
      showToast("Task created");
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      showToast(error.response?.data?.message || "Task could not be saved");
    }
  };

  // Update (edit form)
  
const handleUpdate = async (updatedData) => {
  if (!editingTask) return;

  const id = getId(editingTask);

  const payload = {
    ...updatedData,
    status: normalizeStatus(updatedData.status),
  };

  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      payload,
      getAuthConfig()
    );

    const updated = response.data?.task || response.data;

    setTasks((prev) =>
      prev.map((t) =>
        getId(t) === id ? { ...t, ...payload, ...updated } : t
      )
    );

    setEditingTask(null);
    setShowTaskForm(false);
    showToast("Task updated");
  } catch (error) {
    console.error(
      "Error updating task:",
      error.response?.data || error.message
    );

    showToast(
      error.response?.data?.message || "Task could not be updated"
    );
  }
};


  // Delete (called from the confirm dialog)
  const confirmDelete = async () => {
    const id = getId(deleteTarget);
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      setTasks((prev) => prev.filter((t) => getId(t) !== id));
      setDeleteTarget(null);
      showToast("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
      setDeleteTarget(null);
      showToast(error.response?.data?.message || "Task could not be deleted");
    }
  };

  // Advance status: To Do -> In Progress -> Completed -> To Do
  const handleAdvanceStatus = async (task) => {
    const id = getId(task);
    const nextStatus = NEXT_STATUS[statusKey(task.status)];

    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: nextStatus }, getAuthConfig());
      setTasks((prev) =>
        prev.map((t) => (getId(t) === id ? { ...t, status: nextStatus } : t))
      );
      showToast(`Moved to ${STATUS_LABEL[statusKey(nextStatus)]}`);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      showToast(error.response?.data?.message || "Status could not be updated");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setCategoryFilter("");
  };

  const hasFilters = Boolean(searchQuery || statusFilter || priorityFilter || categoryFilter);

  // Filter + sort by due date (tasks without a due date go last)
  const q = searchQuery.trim().toLowerCase();
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        !q ||
        task.title?.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(q));
      const matchesStatus = !statusFilter || statusKey(task.status) === statusFilter;
      const matchesPriority = !priorityFilter || task.priority?.toLowerCase() === priorityFilter.toLowerCase();
      const matchesCategory = !categoryFilter || task.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return da - db;
    });

  const emptyMessage = tasks.length === 0
    ? "No tasks yet. Click New task to add your first one."
    : "No tasks match these filters. Clear a filter or add a new task.";

  return (
    <DashLayout isDark={isDark} toggleTheme={toggleTheme}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="font-jakarta text-3xl font-semibold tracking-tight sm:text-4xl" style={text}>
              Tasks
            </h1>
            <p className="text-xs sm:text-sm" style={muted}>
              Create, edit and track every task in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTaskForm(true)}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:w-auto"
            style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)" }}
          >
            <Plus size={18} />
            <span>New task</span>
          </button>
        </div>

        {loadError && (
          <div
            role="alert"
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{ backgroundColor: "var(--bad-bg)", color: "var(--bad)", borderColor: "var(--border-color)" }}
          >
            {loadError}
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-search" className="text-xs font-medium" style={muted}>Search</label>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={muted} />
              <input
                id="f-search"
                type="search"
                placeholder="Title, description or tag"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${FIELD} !pl-10`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-status" className="text-xs font-medium" style={muted}>Status</label>
            <select id="f-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={FIELD}>
              <option value="">All statuses</option>
              {STATUS_FILTERS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-priority" className="text-xs font-medium" style={muted}>Priority</label>
            <select id="f-priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={FIELD}>
              <option value="">All priorities</option>
              {PRIORITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-category" className="text-xs font-medium" style={muted}>Category</label>
            <select id="f-category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={FIELD}>
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Tasks table */}
        <div className="overflow-hidden rounded-[26px] border px-6 py-5 shadow-lg backdrop-blur" style={panel}>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-10 text-center text-sm" style={muted}>Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center text-sm" style={muted}>
                <span>{emptyMessage}</span>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-xl border px-4 py-2 text-xs font-semibold"
                    style={{ backgroundColor: "var(--chip-bg)", borderColor: "var(--border-color)", color: "var(--text-color)" }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="text-xs font-medium" style={muted}>
                    <th className="pb-3 pr-3">Task</th>
                    <th className="pb-3 pr-3">Priority</th>
                    <th className="pb-3 pr-3">Status</th>
                    <th className="pb-3 pr-3">Start – Due</th>
                    <th className="pb-3 pr-3">Tags</th>
                    <th className="pb-3 text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const id = getId(task);
                    const key = statusKey(task.status);
                    const priority = task.priority?.toLowerCase() || "medium";
                    const start = formatDate(task.startdate);
                    const due = formatDate(task.duedate);
                    const { Icon, label, main } = ADVANCE_BUTTON[key];

                    return (
                      <tr key={id} className="border-t border-dashed" style={{ borderColor: "var(--border-color)" }}>
                        <td className="py-3.5 pr-3 align-middle">
                          <div className="font-medium" style={text}>{task.title}</div>
                          <div className="mt-0.5 text-xs" style={muted}>
                            {task.category || "General"} · Created {formatDate(task.createdAt) || "recently"}
                          </div>
                        </td>

                        <td className="py-3.5 pr-3 align-middle">
                          <Pill style={PRIORITY_STYLE[priority] || PRIORITY_STYLE.medium}>
                            {task.priority || "Medium"}
                          </Pill>
                        </td>

                        <td className="py-3.5 pr-3 align-middle">
                          <Pill style={STATUS_STYLE[key]}>{STATUS_LABEL[key]}</Pill>
                        </td>

                        <td className="whitespace-nowrap py-3.5 pr-3 align-middle text-xs" style={text}>
                          {start && due ? `${start} – ${due}` : start || due || "—"}
                        </td>

                        <td className="py-3.5 pr-3 align-middle">
                          <div className="flex flex-wrap gap-1">
                            {task.tags && task.tags.length > 0 ? (
                              task.tags.map((tag, idx) => (
                                <span
                                  key={`${tag}-${idx}`}
                                  className="rounded-lg border px-2 py-0.5 text-[11.5px]"
                                  style={{ backgroundColor: "var(--chip-bg)", borderColor: "var(--border-color)", color: "var(--muted-text)" }}
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs" style={muted}>—</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(task)}
                              aria-label={label}
                              title={label}
                              className={ICON_BTN}
                              style={main ? { backgroundColor: "var(--button-bg)", color: "var(--button-text)", borderColor: "transparent" } : undefined}
                            >
                              <Icon size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingTask(task)}
                              aria-label={`Edit ${task.title}`}
                              title="Edit"
                              className={ICON_BTN}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(task)}
                              aria-label={`Delete ${task.title}`}
                              title="Delete"
                              className={`${ICON_BTN} hover:!border-[color:var(--bad)] hover:!text-[color:var(--bad)]`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* New / Edit modal */}
        {(showTaskForm || editingTask) && (
          <EditTask
            isDark={isDark}
            task={editingTask}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />
        )}

        {/* Delete confirmation */}
        {deleteTarget && (
          <div
            className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-black/45 p-4"
            onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              className="flex w-full max-w-[420px] flex-col gap-4 rounded-[26px] border p-6 shadow-2xl"
              style={{ backgroundColor: "var(--card-strong)", borderColor: "var(--border-color)" }}
            >
              <h2 id="delete-title" className="font-jakarta text-[22px] font-semibold" style={text}>
                Delete this task?
              </h2>
              <p className="text-sm" style={muted}>
                “{deleteTarget.title}” will be removed from your list and the board. This cannot be undone.
              </p>
              <div className="flex flex-wrap justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-2xl border px-5 py-3 text-sm font-semibold"
                  style={{ backgroundColor: "var(--chip-bg)", borderColor: "var(--border-color)", color: "var(--text-color)" }}
                >
                  Keep task
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--bad)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            role="status"
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium shadow-xl"
            style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)" }}
          >
            {toast}
          </div>
        )}
      </div>
    </DashLayout>
  );
};

export default Tasks;