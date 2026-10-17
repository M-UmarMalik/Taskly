import mongoose from "mongoose";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, category, priority, status, startdate, duedate, created, tags } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        };

        const task = await Task.create({
            title: title.trim(),
            description,
            category,
            priority,
            status,
            startdate,
            duedate,
            created,
            tags,
            user: req.user.id,
        });

        return res.status(201).json({ message: "Task created successfully", task });


    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "A task with this title already exists in your list. Please use a different title."
            });
        }

        return res.status(500).json({ message: error.message });
    };
};

export const getTasks = async (req, res) => {
    try {
        const { category, priority, status, search } = req.query;

        const filter = {
            user: req.user.id,
        };

        if (category && category !== "All") {
            filter.category = category;
        };

        if (priority && priority !== 'All') {
            filter.priority = priority;
        };

        if (status && status !== "All") {
            filter.status = status;
        };

        if (search && search.trim()) {
            const searchRegex = {
                $regex: search.trim(),
                $options: "i",
            }


            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { tags: searchRegex },
            ];



        };
        const tasks = await Task.find(filter).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    };
};


export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        };

        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        };

        return res.status(200).json({
            success: true,
            task,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    };
};


export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        };


        const allowedFields = [
            "title",
            "description",
            "category",
            "priority",
            "status",
            "startdate",
            "duedate",
            "created",
            "tags",
        ]


        const updates = {};


        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            };
        };

        if (updates.title !== undefined && (typeof updates.title !== "string" || !updates.title.trim())) {
            return res.status(400).json({
                success: false,
                message: "Task title cannot be empty",
            });
        };

        if (updates.title !== undefined) {
            updates.title = updates.title.trim();
        };

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        };

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    };
};


export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "ToDo",
            "In progress",
            "Completed",
        ];

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        };


        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status",
            });
        };


        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id,
            },
            { status },
            {
                new: true,
                runValidators: true,
            }
        );


        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
};

};
