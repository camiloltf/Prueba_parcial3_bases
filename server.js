require("dotenv").config();
const express = require("express");
const path = require("path");
const academicRoutes = require("./routes/academic.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", academicRoutes);
app.use("/enrollments", enrollmentRoutes);

const serverPort = process.env.PORT || 5000;

app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});