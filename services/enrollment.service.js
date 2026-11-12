const { findGroupById } = require("../dao/group.dao");
const {
  findEnrollmentsByGroupId,
  insertEnrollment,
} = require("../dao/enrollment.dao");

async function enrollStudent(studentCode, groupId) {
  const group = await findGroupById(groupId);
  if (!group) {
    return { status: 404, message: "El grupo no existe" };
  }

  const enrollments = await findEnrollmentsByGroupId(groupId);
  if (enrollments.length >= group.capacity) {
    return { status: 409, message: "El grupo está lleno" };
  }

  await insertEnrollment(studentCode, groupId);
  return { status: 201, message: "Inscripción exitosa" };
}

module.exports = { enrollStudent };