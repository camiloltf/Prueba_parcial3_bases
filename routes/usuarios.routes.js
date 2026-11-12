const { Router } = require("express");
const { getUsuarios } = require("../dao/usuarios.dao");
const router = Router();

router.get("/", getUsuarios);

module.exports = router;