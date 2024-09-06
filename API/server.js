const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const app = express();
const AnnoncesGlobale = require('./models/AnnoncesGlobale');

// Middleware pour permettre les requêtes cross-origin (depuis un autre domaine)
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, process.env.MONGO_OPTIONS)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Fonction pour formater la date
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Route pour récupérer les annonces visibles
app.get('/api/annonces', async (req, res) => {
    try {
        let annonces = await AnnoncesGlobale.find();

        console.log('Annonces récupérées:', annonces);
        res.json(annonces);
    } catch (err) {
        console.error('Erreur lors de la récupération des annonces:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route pour masquer une annonce
app.put('/api/annonces/hide', async (req, res) => {
    try {
        const annonceId = req.body.id;
        const annonce = await AnnoncesGlobale.findByIdAndUpdate(annonceId, { toDisplay: false }, { new: true });
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        res.json({ message: 'Annonce masquée avec succès' });
    } catch (err) {
        console.error('Erreur lors du masquage de l\'annonce:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route pour récupérer les annonces cachées
app.get('/api/annonces/hide', async (req, res) => {
    try {
        let annoncesCachees = await AnnoncesGlobale.find({ toDisplay: false });
        
        console.log('Annonces cachées récupérées:', annoncesCachees);
        res.json(annoncesCachees);
    } catch (err) {
        console.error('Erreur lors de la récupération des annonces cachées:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route pour réafficher une annonce masquée
app.put('/api/annonces/show', async (req, res) => {
    try {
        const annonceId = req.body.id;
        const annonce = await AnnoncesGlobale.findByIdAndUpdate(annonceId, { toDisplay: true }, { new: true });
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        res.json({ message: 'Annonce réaffichée avec succès' });
    } catch (err) {
        console.error('Erreur lors du réaffichage de l\'annonce:', err);
        res.status(500).json({ message: err.message });
    }
});


// Lancer le serveur sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
