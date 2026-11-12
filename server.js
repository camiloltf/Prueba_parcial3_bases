require("dotenv").config();
const express = require("express");
const path = require("path");
const enrollmentRoutes = require("./routes/enrollment.routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/enrollments", enrollmentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});