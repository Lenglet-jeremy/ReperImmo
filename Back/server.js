require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialisation de l'application
const app = express();
app.use(express.json());
app.use(cors());

// Configuration de la base de données
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ReperImmoDB";
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, process.env.MONGO_OPTIONS)
    .then(() => console.log(`✅ Connecté à MongoDB: ${mongoose.connection.name}`))
    .catch(err => console.error("❌ Erreur de connexion à MongoDB:", err));

// Définition du modèle pour la collection LBC
const lbcSchema = new mongoose.Schema({
    titre: String,
    prix: Number,
    ville: String
    // Ajoute d'autres champs selon ta structure de données
});
const LBC = mongoose.model("LBC", lbcSchema, "LBC"); // <-- Forçage du nom exact de la collection

// Route pour récupérer toutes les annonces
app.get("/lbc", async (req, res) => {
    try {
        const annonces = await LBC.find();
        res.json(annonces);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lancer le serveur
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
