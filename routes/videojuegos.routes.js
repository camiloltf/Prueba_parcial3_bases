const { Router } = require("express");
const { getAllJuegos, getJuegoById, createJuego } = require("../dao/videojuegos.dao");

const router = Router();

router.get("/", getAllJuegos);
router.get("/:id", getJuegoById);
router.post("/", createJuego);

module.exports = router;