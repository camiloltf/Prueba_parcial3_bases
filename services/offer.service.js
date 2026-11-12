const { findGroupsByPeriod } = require("../dao/group.dao");
const { findEnrollmentsByGroupId } = require("../dao/enrollment.dao");
const firestoreDatabase = require("./firebase.service");

async function buildOfferDocument(groupRecord) {
  const enrollmentRowsForDocument = await findEnrollmentsByGroupId(groupRecord.groupId);

  return {
    groupId: groupRecord.groupId,
    period: groupRecord.period,
    subjectName: groupRecord.subjectName,
    departmentName: groupRecord.departmentName,
    groupNumber: groupRecord.groupNumber,
    professorName: groupRecord.professorName,
    capacity: groupRecord.capacity,
    enrolledCount: enrollmentRowsForDocument.length,
  };
}

async function synchronizeOfferPeriod(periodForSynchronization) {
  const sourceGroupRecords = await findGroupsByPeriod(periodForSynchronization);
  const firestoreWriteTasks = sourceGroupRecords.map(async (groupRecordToSynchronize) => {
    const offerDocumentData = await buildOfferDocument(groupRecordToSynchronize);
    const firestoreDocumentId = `${offerDocumentData.period}_${offerDocumentData.groupId}`;

    await firestoreDatabase
      .collection("oferta")
      .doc(firestoreDocumentId)
      .set(offerDocumentData);
  });

  await Promise.all(firestoreWriteTasks);

  return sourceGroupRecords.length;
}

async function findOfferByDepartmentAndPeriod(departmentNameForFilter, periodCodeForFilter) {
  const firestoreOfferSnapshot = await firestoreDatabase
    .collection("oferta")
    .where("departmentName", "==", departmentNameForFilter)
    .where("period", "==", periodCodeForFilter)
    .get();

  return firestoreOfferSnapshot.docs.map((offerDocumentSnapshot) => offerDocumentSnapshot.data());
}

module.exports = {
  buildOfferDocument,
  findOfferByDepartmentAndPeriod,
  synchronizeOfferPeriod,
};