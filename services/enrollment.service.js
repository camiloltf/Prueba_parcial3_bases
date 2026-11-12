const { findGroupById } = require("../dao/group.dao");
const {
  findEnrollmentsByGroupId,
  insertEnrollment,
} = require("../dao/enrollment.dao");
const { buildOfferDocument } = require("./offer.service");
const firestoreDatabase = require("./firebase.service");

async function enrollStudent(studentCodeForEnrollment, groupIdForEnrollment) {
  const groupRecordBeforeEnrollment = await findGroupById(groupIdForEnrollment);
  if (!groupRecordBeforeEnrollment) {
    return { status: 404, message: "El grupo no existe" };
  }

  const enrollmentRowsBeforeInsert = await findEnrollmentsByGroupId(groupIdForEnrollment);
  if (enrollmentRowsBeforeInsert.length >= groupRecordBeforeEnrollment.capacity) {
    return { status: 409, message: "El grupo está lleno" };
  }

  await insertEnrollment(studentCodeForEnrollment, groupIdForEnrollment);

  const groupRecordAfterEnrollment = await findGroupById(groupIdForEnrollment);
  if (!groupRecordAfterEnrollment) {
    return { status: 404, message: "El grupo ya no está disponible" };
  }

  const updatedOfferDocument = await buildOfferDocument(groupRecordAfterEnrollment);
  const firestoreDocumentId = `${updatedOfferDocument.period}_${updatedOfferDocument.groupId}`;

  await firestoreDatabase
    .collection("oferta")
    .doc(firestoreDocumentId)
    .set(updatedOfferDocument);

  return { status: 201, message: "Inscripción exitosa" };
}

module.exports = { enrollStudent };