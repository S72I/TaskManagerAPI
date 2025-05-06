const asyncHandler = require("express-async-handler");
const Tasks = require("../models/task.model");
const jwt = require("jsonwebtoken");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !description || !dueDate || !priority) {
    res.status(400).json({ err: "All fields are mandatory" });
  } else {
    const task = await Tasks.create({
      user_id: req.user.id,
      title,
      description,
      dueDate,
      priority,
    });
    res.status(200).json(task);
  }
});

const getAllTasks = asyncHandler(async (req, res) => {
  const { isDeleted = "false" } = req.query;
  const allTasks = await Tasks.find({ user_id: req.user.id, isDeleted });
  // const allTasks = await Tasks.find({ isDeleted });
  res.status(200).json(allTasks);
});

// const getTask = asyncHandler(async (req, res) => {
//   const { isDeleted = "false" } = req.query;
//   const task = await Tasks.findById({ _id: req.params.id, isDeleted: isDeleted });

//   if (String(task.user_id) === req.user.id) {
//     res.status(200).json(task);
//   } else {
//     res.status(401).json({ err: "Unauthorized" });
//   }
// });

const getTask = asyncHandler(async (req, res) => {
  const { isDeleted = "false" } = req.query;
  const task = await Tasks.findOne({
    _id: req.params.id,
    isDeleted: isDeleted,
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (String(task.user_id) !== String(req.user.id)) {
    return res
      .status(403)
      .json({ error: "Forbidden: You don't own this task" });
  }

  res.status(200).json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Tasks.findById(req.params.id);
  if (String(task.user_id) === req.user.id) {
    task.isDeleted = "true";
    res.status(200).json(task);
    await task.save();
  } else {
    res.status(401).json({ err: "Unauthorized" });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    // if (!title || !description || !dueDate || !priority ) {
    //   res.status(400).json({ err: "All fields are mandatory" });
    // }

    if (String(task.user_id) === req.user.id) {
      const updateTask = await Tasks.findByIdAndUpdate(task, req.body, {
        new: true,
      });
      res.status(200).json(updateTask);
    } else {
      res.status(401).json({ err: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

const completeTask = asyncHandler(async (req, res) => {
  const task = await Tasks.findById(req.params.id);
  if (String(task.user_id) === req.user.id) {
    task.status = "completed";
    res.status(200).json(task);
    await task.save();
  } else {
    res.status(401).json({ err: "Unauthorized" });
  }
});

const filterTaskStatus = asyncHandler(async (req, res) => {
  const { status, isDeleted = "false" } = req.query;
  if (!status) {
    return res
      .status(400)
      .json({ message: "Status query parameter is required" });
  }
  const filteredTasks = await Tasks.find({
    status: status,
    isDeleted: isDeleted,
  });

  if (filteredTasks.length === 0) {
    return res
      .status(404)
      .json({ message: "No tasks found matching the criteria" });
  }
  res.status(200).json(filteredTasks);
});

// const searchTasks = asyncHandler(async (req, res) => {
//   const { title, description } = req.query;

//   const query = { user_id: req.user.id };

//   const regexPattern = new RegExp(`${title}`);

//   if (title) query.title = { $regex: regexPattern };
//   if (description) query.description = { $regex: description };

//   const tasks = await Tasks.find(query);

//   if (!tasks.length) {
//     res.status(404).json({ err: "No tasks found matching your criteria" });
//   }
//   res.status(200).json(tasks);
// });

// const searchTasks = asyncHandler(async (req, res) => {
//   const { title, description } = req.query;

//   const query = { user_id: req.user.id };

//   if (title) {
//     query.title = { $regex: new RegExp(title, "i") };
//   }

//   if (description) {
//     query.description = { $regex: new RegExp(description, "i") };
//   }

//   const tasks = await Tasks.find(query);

//   if (!tasks.length) {
//     return res
//       .status(404)
//       .json({ err: "No tasks found matching your criteria" });
//   }

//   res.status(200).json(tasks);
// });

const searchTasks = asyncHandler(async (req, res) => {
  const { title, description } = req.query;
  const query = { user_id: req.user.id };
  const orConditions = [];

  if (title) {
    orConditions.push({ title: { $regex: new RegExp(title, "i") } });
  }
  if (description) {
    orConditions.push({
      description: { $regex: new RegExp(description, "i") },
    });
  }

  if (orConditions.length) {
    query.$or = orConditions;
  }

  const tasks = await Tasks.find(query);

  if (!tasks.length) {
    return res
      .status(404)
      .json({ err: "No tasks found matching your criteria" });
  }

  res.status(200).json(tasks);
});

const sortTasks = asyncHandler(async (req, res) => {
  const { order, priority, isDeleted = "false" } = req.query;

  const query = { isDeleted: isDeleted, user_id: req.user.id };

  if (priority) {
    query.priority = priority;
  }

  let tasks = await Tasks.find(query);

  if (order) {
    tasks = tasks.sort((a, b) =>
      order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }

  if (!tasks.length) {
    res.status(404).json({ error: "No tasks found matching your criteria" });
    return;
  }

  res.status(200).json(tasks);
});

// const pagination = asyncHandler(async (req, res) => {
//   let { page, limit, isDeleted = "false" } = req.query;

//   let allTasks = await Tasks.find({
//     user_id: req.user.id,
//     isDeleted,
//   })
//     .limit(limit)
//     .skip((page - 1) * limit);

//   const tasksLength = await Tasks.countDocuments();

//   if (!allTasks) {
//     res.status(401).json("No tasks Found");
//   }
//   res.status(200).json({
//     allTasks,
//     totalPages: Math.ceil(tasksLength / limit),
//     currentPage: parseInt(page),
//   });
// });
const pagination = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, isDeleted = "false" } = req.query;

  page = Math.max(1, parseInt(page));
  limit = Math.max(1, parseInt(limit));

  const isDeletedBool = isDeleted === "true";

  try {
    const allTasks = await Tasks.find({
      user_id: req.user.id,
      isDeleted: isDeletedBool,
    })
      .limit(limit)
      .skip((page - 1) * limit);

    const tasksLength = await Tasks.countDocuments({
      user_id: req.user.id,
      isDeleted: isDeletedBool,
    });

    if (allTasks.length === 0) {
      return res.status(404).json("No tasks found.");
    }

    // Send paginated response
    res.status(200).json({
      allTasks,
      totalPages: Math.ceil(tasksLength / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// const priorityFilter = asyncHandler(async (req, res) => {
//   const { priority, isDeleted = "false" } = req.query;
//   if (!priority) {
//     return res
//       .status(400)
//       .json({ message: "priority query parameter is required" });
//   }
//   const searchPriority = await Tasks.find({
//     priority: priority,
//     isDeleted: isDeleted,
//   });

//   if (searchPriority.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "No title found matching the criteria" });
//   }
//   res.status(200).json(searchPriority);
// });

module.exports = {
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
};
