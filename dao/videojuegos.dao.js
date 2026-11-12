const db = require("../services/firebase.service");

const getVideojuegos = async (req, res) => {
    try {
        const snapshot = await db.collection("videojuegos").get();
        const juegos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(juegos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getVideojuegos };