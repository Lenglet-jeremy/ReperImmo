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

// Route pour récupérer les annonces visibles (listées)
app.get('/api/annonces/listed', async (req, res) => {
    // try {
    //     let annoncesVisibles = await AnnoncesGlobale.find({ toDisplay: true });
        
    //     console.log('Annonces listées récupérées:', annoncesVisibles);
    //     res.json(annoncesVisibles);
    // } catch (err) {
    //     console.error('Erreur lors de la récupération des annonces listées:', err);
    //     res.status(500).json({ message: err.message });
    // }
});

// Route pour ajouter une annonce à la liste des annonces listées
app.post('/api/annonces/listed', async (req, res) => {
    try {
        const { id, Titre, Prix, Image, Description, LienAnnonce } = req.body;

        // Vérifier si l'annonce existe déjà
        let annonce = await AnnoncesGlobale.findById(id);
        if (!annonce) {
            return res.status(404).json({ message: "Annonce non trouvée" });
        }

        // Ajouter ou mettre à jour les propriétés de l'annonce
        annonce = await AnnoncesGlobale.findByIdAndUpdate(
            id, 
            {
                Titre,
                Prix,
                Image,
                Description,
                LienAnnonce,
                toDisplay: true  // Marquer l'annonce comme visible/listée
            },
            { new: true }
        );

        res.json({ message: "Annonce ajoutée à la liste avec succès", annonce });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'annonce à la liste:", err);
        res.status(500).json({ message: err.message });
    }
});



// Route pour récupérer les annonces visibles
app.get('/api/annonces', async (req, res) => {
    try {
        let annonces = await AnnoncesGlobale.find();

        // console.log('Annonces récupérées:', annonces);
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
