const { pool } = require("../services/mysql.service");

const GROUP_DETAIL_SELECT = `
  SELECT class_group.id AS groupId,
         class_group.period AS period,
         class_group.group_number AS groupNumber,
         class_group.capacity AS capacity,
         subject.name AS subjectName,
         department.name AS departmentName,
         professor.name AS professorName
  FROM class_group
  JOIN subject ON subject.id = class_group.subject_id
  JOIN department ON department.id = subject.department_id
  JOIN professor ON professor.id = class_group.professor_id`;

async function findGroupsByPeriod(period) {
  const [rows] = await pool.query(
    `${GROUP_DETAIL_SELECT} WHERE class_group.period = ? ORDER BY class_group.id`,
    [period]
  );
  return rows;
}

async function findGroupById(groupId) {
  const [rows] = await pool.query(
    `${GROUP_DETAIL_SELECT} WHERE class_group.id = ?`,
    [groupId]
  );
  return rows[0];
}

module.exports = { findGroupsByPeriod, findGroupById };