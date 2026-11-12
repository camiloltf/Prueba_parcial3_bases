// offerQuery.js
const firestoreDatabase = require("../services/firebase.service");

async function getOfferByDepartmentAndPeriod(departmentName, periodCode) {
  const offerQuerySnapshot = await firestoreDatabase
    .collection("oferta")
    .where("departmentName", "==", departmentName)
    .where("period", "==", periodCode)
    .get();

  const offerDocumentList = offerQuerySnapshot.docs.map((offerDocumentSnapshot) => {
    return { documentId: offerDocumentSnapshot.id, ...offerDocumentSnapshot.data() };
  });

  return offerDocumentList;
}

module.exports = { getOfferByDepartmentAndPeriod };