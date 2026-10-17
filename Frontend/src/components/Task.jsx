import { useState } from "react";
import { X } from "lucide-react";

const NewTask = ({ onClose, onCreate, isDark = true }) => {
  const today = new Date().toLocaleDateString("en-CA");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Work",
    priority: "Medium",
    status: "ToDo",
    startDate: today,
    dueDate: today,
    created: today,
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    onCreate?.(formData);
  };

  // Theme colors
  const cardStyle = isDark
    ? "border-[#363740] bg-[#202128] text-[#E7E8F0]"
    : "border-[#D9DAE5] bg-[#F7F7FC] text-[#242530]";

  const inputStyle = isDark
    ? "border-[#41424C] bg-[#303139] text-[#E5E7EF] placeholder:text-[#777780] focus:border-[#8AA0FF]"
    : "border-[#D6D7E1] bg-white text-[#292A33] placeholder:text-[#9293A0] focus:border-[#6A86F2]";

  const labelStyle = isDark
    ? "mb-2 block text-xs text-[#A5A7B9]"
    : "mb-2 block text-xs text-[#696B7B]";

  const selectStyle = isDark
    ? "border-[#41424C] bg-[#303139] text-[#E5E7EF] focus:border-[#8AA0FF]"
    : "border-[#D6D7E1] bg-white text-[#292A33] focus:border-[#6A86F2]";

  const fieldClass = `w-full rounded-[15px] border px-3.5 py-3 text-sm outline-none transition ${inputStyle}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {/* Main Card */}
      <div
        className={`my-auto w-full max-w-[560px] rounded-[28px] border p-5 shadow-2xl transition-colors sm:p-[26px] ${cardStyle}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[22px] font-bold tracking-tight">
            New task
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`rounded-lg p-1 transition ${
              isDark
                ? "text-[#A5A7B9] hover:bg-[#303139] hover:text-white"
                : "text-[#777989] hover:bg-[#E6E7F0] hover:text-black"
            }`}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[17px]">
          {/* Title */}
          <div>
            <label className={labelStyle} htmlFor="task-title">
              Title
            </label>

            <input
              id="task-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={fieldClass}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelStyle} htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a few details"
              rows={3}
              className={`${fieldClass} min-h-[84px] resize-y`}
            />
          </div>

          {/* Category, Priority, Status */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="min-w-0">
              <label className={labelStyle} htmlFor="task-category">
                Category
              </label>

              <select
                id="task-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full cursor-pointer rounded-[15px] border px-3.5 py-3 text-sm outline-none ${selectStyle}`}
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Study</option>
                <option>Health</option>
                <option>Other</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className={labelStyle} htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full cursor-pointer rounded-[15px] border px-3.5 py-3 text-sm outline-none ${selectStyle}`}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className={labelStyle} htmlFor="task-status">
                Status
              </label>

              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full cursor-pointer rounded-[15px] border px-3.5 py-3 text-sm outline-none ${selectStyle}`}
              >
                <option>ToDo</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="min-w-0">
              <label className={labelStyle} htmlFor="task-start-date">
                Start date
              </label>

              <input
                id="task-start-date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`${fieldClass} min-w-0 [color-scheme:${isDark ? "dark" : "light"}]`}
              />
            </div>

            <div className="min-w-0">
              <label className={labelStyle} htmlFor="task-due-date">
                Due date
              </label>

              <input
                id="task-due-date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={formData.startDate}
                className={`${fieldClass} min-w-0 [color-scheme:${isDark ? "dark" : "light"}]`}
              />
            </div>

            <div className="min-w-0">
              <label className={labelStyle} htmlFor="task-created">
                Created
              </label>

              <input
                id="task-created"
                type="date"
                name="created"
                value={formData.created}
                readOnly
                className={`${fieldClass} min-w-0 cursor-not-allowed [color-scheme:${isDark ? "dark" : "light"}]`}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelStyle} htmlFor="task-tags">
              Tags
            </label>

            <input
              id="task-tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separate with commas, e.g. design, urgent"
              className={fieldClass}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-2.5 pt-8">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-[15px] border px-5 py-3 text-sm font-semibold transition ${
                isDark
                  ? "border-[#41424C] bg-[#303139] text-[#E5E7EF] hover:bg-[#3A3B45]"
                  : "border-[#D6D7E1] bg-[#E8E9F1] text-[#292A33] hover:bg-[#DCDDE8]"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`rounded-[15px] px-5 py-3 text-sm font-semibold transition ${
                isDark
                  ? "bg-[#E9EAF2] text-[#292A33] hover:bg-white"
                  : "bg-[#292A33] text-white hover:bg-[#41424C]"
              }`}
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTask;