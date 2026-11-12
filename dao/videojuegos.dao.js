const db = require('../services/firebase.service'); // Tu servicio de conexión a Firebase

const COLLECTION = 'videojuegos'; // Apuntamos a la nueva colección que creaste

// 1. Obtener todos los videojuegos
const getAllJuegos = async (req, res) => {
    try {
        const snapshot = await db.collection(COLLECTION).get();
        // Mapeamos los documentos para incluir su ID único y sus campos[cite: 11]
        const juegos = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        res.status(200).json(juegos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Obtener un videojuego por su ID (ej. /videojuegos/juego3)
const getJuegoById = async (req, res) => {
    try {
        const docSnap = await db.collection(COLLECTION).doc(req.params.id).get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: 'Videojuego no encontrado' });
        }

        res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Crear un nuevo videojuego
const createJuego = async (req, res) => {
    try {
        const { Nombre, Precio, Disponible, Plataformas } = req.body;
        
        if (!Nombre || !Precio) {
            return res.status(400).json({ error: 'El nombre y el precio son obligatorios' });
        }

        // Si usas .add(), Firestore le asigna un ID automático, o puedes usar .doc('id_personalizado').set({...})
        const docRef = await db.collection(COLLECTION).add({
            Nombre,
            Precio,
            Disponible: Disponible ?? true,
            Plataformas: Plataformas || []
        });

        res.status(201).json({ id: docRef.id, Nombre, Precio, Disponible, Plataformas });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllJuegos,
    getJuegoById,
    createJuego
};