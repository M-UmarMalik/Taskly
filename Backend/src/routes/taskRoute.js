import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/TaskController.js";

const router =express.Router();

router.use(authMiddleware);

router.post("/", createTask);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.patch("/:id/status", updateTaskStatus);

router.delete("/:id", deleteTask);

export default router;