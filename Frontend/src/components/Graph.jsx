import { useState, useEffect } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_URL = import.meta.env.API_URL;

const WeeklyProgress = ({ isDark }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view progress.");
          return;
        }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        const taskList = Array.isArray(data)
          ? data
          : data.tasks || data.data || [];

        setTasks(taskList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load weekly progress."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Check whether a task is completed
  const isCompleted = (task) => {
    const status = String(task.status || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");

    return status === "completed" || task.completed === true;
  };

  // Get the current week's Monday
  const today = new Date();
  const monday = new Date(today);

  monday.setHours(0, 0, 0, 0);

  const currentDay = monday.getDay();

  monday.setDate(
    monday.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
  );

  // Build graph data from backend tasks
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const dayTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;

      return String(task.dueDate).slice(0, 10) === dateKey;
    });

    const total = dayTasks.length;
    const completed = dayTasks.filter(isCompleted).length;

    const progress =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      progress,
      total,
      completed,
    };
  });

  return (
    <div
      className="w-full min-w-0 rounded-2xl border p-3 shadow-[0_20px_20px_-15px_rgba(0,0,0,0.3)] sm:p-5"
      style={{
        backgroundColor: "var(--card-solid)",
        borderColor: isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(40,42,80,0.09)",
        color: "var(--text-color)",
      }}
    >
      <div className="mb-4">
        <h2 className="text-base font-bold sm:text-xl">
          Weekly Progress
        </h2>

        <p
          className="mt-1 text-xs sm:text-sm"
          style={{ color: "var(--muted-text)" }}
        >
          Task completion this week
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm text-gray-400 sm:h-48">
          Loading progress...
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center text-center text-sm text-red-500 sm:h-48">
          {error}
        </div>
      ) : (
        <div className="h-40 w-full min-w-0 sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklyData}
              margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#383946" : "#e5e7eb"}
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 11,
                  fill: isDark ? "#9a9db1" : "#777a8c",
                }}
                axisLine={false}
                tickLine={false}
                interval={0}
                tickMargin={8}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{
                  fontSize: 10,
                  fill: isDark ? "#9a9db1" : "#777a8c",
                }}
                axisLine={false}
                tickLine={false}
                width={38}
              />

              <Tooltip
                formatter={(value, name, item) => [
                  `${value}% (${item.payload.completed}/${item.payload.total} tasks)`,
                  "Progress",
                ]}
                contentStyle={{
                  backgroundColor: isDark ? "#1e2029" : "#ffffff",
                  border: `1px solid ${
                    isDark ? "#383946" : "#e5e7eb"
                  }`,
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: isDark ? "#eceef7" : "#22232b",
                }}
              />

              <Line
                type="monotone"
                dataKey="progress"
                stroke="#6a86f2"
                strokeWidth={3}
                dot={{
                  r: 3,
                  fill: "#6a86f2",
                  strokeWidth: 0,
                }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklyProgress;