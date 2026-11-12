const express = require("express");
const {
  findOfferByDepartmentAndPeriod,
  synchronizeOfferPeriod,
} = require("../services/offer.service");
const { enrollStudent } = require("../services/enrollment.service");

const academicRouter = express.Router();

academicRouter.post("/sync/oferta/:periodo", async (syncRequest, syncResponse) => {
  try {
    const requestedPeriod = syncRequest.params.periodo;
    if (!requestedPeriod) {
      return syncResponse.status(400).json({ message: "El periodo es obligatorio." });
    }

    const synchronizedGroupCount = await synchronizeOfferPeriod(requestedPeriod);

    return syncResponse.status(200).json({
      message: `Se sincronizaron ${synchronizedGroupCount} grupos.`,
      groupsSynced: synchronizedGroupCount,
    });
  } catch (syncRouteError) {
    console.error("Offer synchronization failed:", syncRouteError.message);
    return syncResponse
      .status(500)
      .json({ message: "No fue posible sincronizar la oferta. Intenta de nuevo." });
  }
});

academicRouter.get("/oferta", async (offerRequest, offerResponse) => {
  try {
    const requestedDepartment = offerRequest.query.dependencia;
    const requestedOfferPeriod = offerRequest.query.periodo;

    if (
      typeof requestedDepartment !== "string" ||
      typeof requestedOfferPeriod !== "string" ||
      !requestedDepartment.trim() ||
      !requestedOfferPeriod.trim()
    ) {
      return offerResponse
        .status(400)
        .json({ message: "La dependencia y el periodo son obligatorios." });
    }

    const firestoreOfferRecords = await findOfferByDepartmentAndPeriod(
      requestedDepartment,
      requestedOfferPeriod
    );

    return offerResponse.status(200).json(firestoreOfferRecords);
  } catch (offerRouteError) {
    console.error("Offer lookup failed:", offerRouteError.message);
    return offerResponse
      .status(500)
      .json({ message: "No fue posible consultar la oferta. Intenta de nuevo." });
  }
});

academicRouter.post("/inscripcion", async (enrollmentRequest, enrollmentResponse) => {
  try {
    const submittedEnrollmentBody = enrollmentRequest.body || {};
    const requestedStudentCode = submittedEnrollmentBody.studentCode;
    const requestedGroupId = Number(submittedEnrollmentBody.groupId);

    if (
      typeof requestedStudentCode !== "string" ||
      !requestedStudentCode.trim() ||
      !Number.isInteger(requestedGroupId) ||
      requestedGroupId <= 0
    ) {
      return enrollmentResponse
        .status(400)
        .json({ message: "El código del estudiante y el id del grupo son obligatorios." });
    }

    const enrollmentResult = await enrollStudent(
      requestedStudentCode.trim(),
      requestedGroupId
    );

    return enrollmentResponse
      .status(enrollmentResult.status)
      .json({ message: enrollmentResult.message });
  } catch (enrollmentRouteError) {
    if (enrollmentRouteError.code === "ER_DUP_ENTRY") {
      return enrollmentResponse
        .status(409)
        .json({ message: "El estudiante ya está inscrito en este grupo." });
    }

    if (enrollmentRouteError.code === "ER_NO_REFERENCED_ROW_2") {
      return enrollmentResponse
        .status(400)
        .json({ message: "El estudiante no existe en la base de datos." });
    }

    console.error("Enrollment failed:", enrollmentRouteError.message);
    return enrollmentResponse.status(500).json({
      message:
        "No se pudo completar la inscripción o actualizar la oferta. Verifica el resultado antes de reintentar.",
    });
  }
});

module.exports = academicRouter;
