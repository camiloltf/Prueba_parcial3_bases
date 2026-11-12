const { findEnrollmentsByGroupId } = require("../dao/enrollment.dao");

async function buildOfferDocument(group) {
  const enrollments = await findEnrollmentsByGroupId(group.groupId);
  return { ...group, enrolled: enrollments.length };
}

module.exports = { buildOfferDocument };