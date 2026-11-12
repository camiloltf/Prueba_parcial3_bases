const { pool } = require("../services/mysql.service");

async function findEnrollmentsByGroupId(groupId) {
  const [rows] = await pool.query(
    "SELECT student_code FROM enrollment WHERE class_group_id = ?",
    [groupId]
  );
  return rows;
}

async function insertEnrollment(studentCode, groupId) {
  await pool.query(
    "INSERT INTO enrollment (student_code, class_group_id) VALUES (?, ?)",
    [studentCode, groupId]
  );
}

module.exports = { findEnrollmentsByGroupId, insertEnrollment };