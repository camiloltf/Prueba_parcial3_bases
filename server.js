const express = require("express");
const usuariosRoutes = require("./routes/usuarios.routes");
const videojuegosRoutes = require("./routes/videojuegos.routes");

const app = express();
app.use(express.json());

app.use("/api/usuarios", usuariosRoutes); 
app.use("/api/videojuegos", videojuegosRoutes); 

app.listen(5000, () => {
    console.log("Servidor corriendo en http://localhost:5000");
});