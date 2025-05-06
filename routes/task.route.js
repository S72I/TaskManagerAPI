const express = require("express");
const validWebToken = require("../middlewares/validateTokenHandler");
const {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
  completeTask,
  filterTaskStatus,
  searchTasks,
  sortTasks,
  pagination,
} = require("../controllers/task.controller");

const taskRoutes = express.Router();

taskRoutes.get("/status", filterTaskStatus);

taskRoutes.use(validWebToken);

taskRoutes.get("/search", searchTasks);

taskRoutes.get("/sort", sortTasks);

taskRoutes.get("/pagination", pagination);

taskRoutes.get("", getAllTasks);

taskRoutes.post("/create", createTask);
taskRoutes.get("/:id", getTask);
taskRoutes.delete("/delete/:id", deleteTask);
taskRoutes.put("/update/:id", updateTask);
taskRoutes.patch("/:id/complete", completeTask);

module.exports = { taskRoutes };
