const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../env/serviceAccountKey.json");

// Inicializamos la aplicación usando la sintaxis modular
initializeApp({
    credential: cert(serviceAccount)
});

// Obtenemos la instancia de Firestore
const db = getFirestore();

module.exports = db;