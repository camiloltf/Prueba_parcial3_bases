const express = require("express");
const { enrollStudent } = require("../services/enrollment.service");

const router = express.Router();

router.post("/", async (req, res) => {
  const { studentCode, groupId } = req.body;

  if (!studentCode || !Number.isInteger(Number(groupId))) {
    return res.status(400).json({ message: "Código de estudiante o id de grupo inválido" });
  }

  try {
    const result = await enrollStudent(studentCode, Number(groupId));
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Error al inscribir al estudiante" });
  }
});

module.exports = router;