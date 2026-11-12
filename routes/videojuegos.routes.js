const { Router } = require("express");
const { getVideojuegos } = require("../dao/videojuegos.dao");
const router = Router();

router.get("/", getVideojuegos);

module.exports = router;