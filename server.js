const express = require("express");
const videojuegosRoutes = require("./routes/videojuegos.routes");

const PORT = 5000;
const api = express();

api.use(express.json());
api.use(express.static("public"));

api.use("/api/videojuegos", videojuegosRoutes);

api.get("/", (req, res) => {
    res.json({ mensaje: "¡El servidor de la API está activo y funcionando correctamente!" });
});

api.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});