// const express = require("express");
// const DBConnection = require("./config/DBconfig.js");
// const { userRoutes } = require("./routes/user.route.js");
// const { taskRoutes } = require("./routes/task.route.js");
// const cors = require("cors");

// require("dotenv").config();
// const app = express();

// const PORT = process.env.PORT || 5000;

// DBConnection();
// app.use(express.json());
// app.use(cors());

// app.use("/api/users", userRoutes);
// app.use("/api/tasks", taskRoutes);

// app.get("/", (req, res) => {
//   res.send("Working on Rendeer");
// });

// app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));


require("dotenv").config();
const express = require("express");
const DBConnection = require("./config/DBconfig.js");
const { userRoutes } = require("./routes/user.route.js");
const { taskRoutes } = require("./routes/task.route.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

DBConnection();

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-vercel-project.vercel.app" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Working on Render");
});

app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));

