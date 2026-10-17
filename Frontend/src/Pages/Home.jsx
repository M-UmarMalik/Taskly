import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import DashLayout from "../components/DashLayout";
import NewTask from "../components/Task.jsx";
import WeeklyProgress from "../components/Graph.jsx";
import logo1 from "../assets/logo1.png";
import hill from "../assets/Group 1.png";

const API_URL = import.meta.env.VITE_API_URL;

const Home = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Backend se logged-in user ke tasks fetch karo
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your tasks.");
          return;
        }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Backend response array ya object dono ho sakta hai
        const data = response.data;
        const taskList = Array.isArray(data)
          ? data
          : data.tasks || data.data || [];

        setTasks(taskList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load tasks. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Status values ko consistent banao
  const isCompleted = (task) => {
    const status = String(task.status || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    return status === "completed" || task.completed === true;
  };

  // Week ke Monday se Saturday tak ke din
  const days = [
    { key: "Mon", label: "Mon" },
    { key: "Tue", label: "Tue" },
    { key: "Wed", label: "Wed" },
    { key: "Thu", label: "Thu" },
    { key: "Fri", label: "Fri" },
    { key: "Sat", label: "Sat" },
  ];

  // Is week ki Monday date calculate karo
  const today = new Date();
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);

  const dayOfWeek = monday.getDay();
  monday.setDate(monday.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  // Due date ke mutabiq workload calculate karo
  const workloadData = days.map((day, index) => {
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + index);

    const dateKey = [
      targetDate.getFullYear(),
      String(targetDate.getMonth() + 1).padStart(2, "0"),
      String(targetDate.getDate()).padStart(2, "0"),
    ].join("-");

    const dayTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;

      return String(task.dueDate).slice(0, 10) === dateKey;
    });

    const total = dayTasks.length;
    const completed = dayTasks.filter(isCompleted).length;

    const percentage =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      ...day,
      total,
      completed,
      percentage,
    };
  });

  // Task create hone par list update karo
  const handleCreate = async (newTaskData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(API_URL, newTaskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      const createdTask = data.task || data.data || data;

      if (createdTask && (createdTask._id || createdTask.id)) {
        setTasks((prev) => [...prev, createdTask]);
      } else {
        // Agar backend sirf success message de to list dobara fetch hogi
        const refreshed = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = refreshed.data;
        setTasks(
          Array.isArray(result)
            ? result
            : result.tasks || result.data || []
        );
      }

      setShowTaskForm(false);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Task create nahi ho saka. Please try again."
      );
    }
  };

  // Task par click karne se /task page open hoga
  const openTask = (task) => {
    navigate("/task", {
      state: { selectedTask: task },
    });
  };

  // Open tasks
  const openTasks = tasks.filter((task) => !isCompleted(task));

  return (
    <DashLayout isDark={isDark} toggleTheme={toggleTheme}>
      {/* Header and Quick Cards */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-5xl">
            Welcome, Liam!
          </h1>

          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--muted-text)" }}
          >
            Plan your tasks and finish more every day.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-stretch">
            {/* Add Task */}
            <button
              type="button"
              onClick={() => setShowTaskForm(true)}
              className={`flex h-[60px] w-full shrink-0 cursor-pointer items-center justify-center rounded-2xl pb-1 text-xl font-semibold transition hover:scale-[1.02] sm:h-[75px] sm:w-[70px] ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}
              aria-label="Add new task"
            >
              +
            </button>

            {/* Task Statistics */}
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className={`flex min-h-[70px] w-full cursor-pointer flex-col justify-center gap-1 rounded-2xl border border-transparent px-3 py-2 hover:border-[#6A86F2] sm:min-h-[75px] sm:min-w-[150px] sm:flex-1 sm:pr-9 ${
                  isDark ? "text-white" : "text-black"
                }`}
                style={{ backgroundColor: "var(--card-solid)" }}
                onClick={() => navigate("/task")}
              >
                <span className="text-xs font-semibold sm:text-sm">
                  {card === 1
                    ? "Open Tasks"
                    : card === 2
                      ? "Completed"
                      : "Total Tasks"}
                </span>

                <p className="mt-0.5 text-xs text-gray-400">
                  {loading
                    ? "Loading..."
                    : card === 1
                      ? `${openTasks.length} open task(s)`
                      : card === 2
                        ? `${tasks.filter(isCompleted).length} completed`
                        : `${tasks.length} task(s)`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Main Cards */}
      <div className="grid grid-cols-1 gap-4 pt-5 lg:grid-cols-2">
        {/* Card 1: Workload This Week */}
        <div
          className={`flex h-72 w-full flex-col justify-between rounded-3xl p-6 shadow-[0_20px_20px_-15px_rgba(0,0,0,0.3)] sm:h-85 sm:rounded-4xl ${
            isDark
              ? "border border-gray-700 text-white"
              : "border-none text-black"
          }`}
          style={{ backgroundColor: "var(--card-solid)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight">
              Workload this week
            </h3>

            <span className="text-xs font-medium text-gray-400">
              Tasks due per day
            </span>
          </div>

          <div className="flex flex-1 items-end justify-between gap-3 px-2 pb-1 pt-6 sm:gap-4">
            {workloadData.map((item) => {
              const heightStyle =
                item.total === 0 ? "2px" : `${item.percentage}%`;

              return (
                <div
                  key={item.key}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div
                    className={`mb-2 min-h-[16px] text-[11px] font-semibold sm:text-xs ${
                      isDark ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {item.percentage}%
                  </div>

                  <div
                    className={`flex h-full w-full max-w-[65px] items-end overflow-hidden rounded-t-xl ${
                      isDark ? "bg-[#272832]" : "bg-[#EFEFF5]"
                    }`}
                  >
                    <div
                      style={{ height: heightStyle }}
                      className={`w-full rounded-t-xl transition-all duration-700 ${
                        item.percentage > 0
                          ? "bg-gradient-to-t from-[#3D4362] via-[#6573BE] to-[#A3B2FF] shadow-[0_0_12px_rgba(123,139,219,0.3)]"
                          : "bg-[#363740]"
                      }`}
                    />
                  </div>

                  <span className="mt-3 text-xs font-semibold text-gray-400">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Backend Task List */}
        <div
          className={`flex h-72 w-full flex-col overflow-hidden rounded-3xl p-5 shadow-[0_20px_20px_-15px_rgba(0,0,0,0.3)] sm:h-85 sm:rounded-4xl ${
            isDark
              ? "border border-gray-700 text-white"
              : "border-none text-black"
          }`}
          style={{ backgroundColor: "var(--card-solid)" }}
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Task List</h3>

            <button
              type="button"
              onClick={() => navigate("/task")}
              className="text-xs font-semibold text-[#6A86F2] hover:underline"
            >
              View all
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <p className="text-sm text-gray-400">
                No tasks found. Add your first task!
              </p>

              <button
                type="button"
                onClick={() => setShowTaskForm(true)}
                className="rounded-xl bg-[#6A86F2] px-4 py-2 text-sm font-semibold text-white"
              >
                + Add Task
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {tasks.slice(0, 6).map((task) => (
                <button
                  key={task._id || task.id}
                  type="button"
                  onClick={() => openTask(task)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition hover:border-[#6A86F2] ${
                    isDark
                      ? "border-gray-700 hover:bg-white/5"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {task.dueDate
                        ? `Due: ${String(task.dueDate).slice(0, 10)}`
                        : "No due date"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                      isCompleted(task)
                        ? "bg-green-500/10 text-green-500"
                        : "bg-[#6A86F2]/10 text-[#6A86F2]"
                    }`}
                  >
                    {task.status || "To Do"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Next Up */}
        <div
          className={`relative h-76 w-full overflow-hidden rounded-3xl shadow-[0_20px_20px_-15px_rgba(0,0,0,0.3)] sm:rounded-4xl ${
            isDark
              ? "border border-gray-700"
              : "border-none"
          }`}
          style={{ backgroundColor: "var(--card-solid)" }}
        >
          <h2 className="relative z-10 flex items-center gap-2 px-8 pt-4 text-xl">
            <img src={logo1} className="h-6 w-6" alt="Next Up" />
            Next Up
          </h2>

          <button
            type="button"
            className={`absolute bottom-6 left-8 z-10 rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:scale-105 ${
              isDark
                ? "bg-white text-black"
                : "bg-black text-white"
            }`}
            onClick={() => setShowTaskForm(true)}
          >
            + Add Task
          </button>

          <img
            src={hill}
            alt="Hills illustration"
            className="absolute bottom-0 right-0 h-32 w-auto max-w-[55%] object-contain object-right-bottom sm:h-36"
          />
        </div>

        {/* Card 4: Weekly Progress */}
        <div className="h-60">
          <WeeklyProgress isDark={isDark} />
        </div>
      </div>

      {/* New Task Modal */}
      {showTaskForm && (
        <NewTask
          isDark={isDark}
          onClose={() => setShowTaskForm(false)}
          onCreate={handleCreate}
        />
      )}
    </DashLayout>
  );
};

export default Home;  