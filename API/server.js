const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const app = express();
const AnnoncesGlobale = require('./models/AnnoncesGlobale');
const ListedAnnonces = require('./models/ListedAnnonces');  // Importer le modèle pour les annonces listées

// Middleware pour permettre les requêtes cross-origin (depuis un autre domaine)
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, process.env.MONGO_OPTIONS)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));


// Route pour récupérer les annonces listées
app.get('/api/annonces/listed', async (req, res) => {
    try {
        const annonces = await ListedAnnonces.find();
        console.log("Annonces listées:", annonces);  // Ajouter ce log
        res.json(annonces);
    } catch (err) {
        console.error("Erreur lors de la récupération des annonces listées:", err);
        res.status(500).json({ message: err.message });
    }
});


// Route pour ajouter une annonce à la liste des annonces listées
app.post('/api/annonces/listed', async (req, res) => {
    try {
        const { id } = req.body;

        // Vérifier si l'annonce est déjà dans la liste
        const annonceExistante = await ListedAnnonces.findOne({ _id: id });
        if (annonceExistante) {
            return res.status(400).json({ message: "L'annonce est déjà listée." });
        }

        // Trouver l'annonce dans la base de données globale
        const annonce = await AnnoncesGlobale.findById(id);
        if (!annonce) {
            return res.status(404).json({ message: "Annonce non trouvée." });
        }

        // Créer une nouvelle annonce dans la collection ListedAnnonces
        const newAnnonce = new ListedAnnonces({
            title: annonce.Titre,   // Utilisez les bons noms de champs
            image: annonce.Image
            // Ajoutez d'autres champs nécessaires ici
        });

        await newAnnonce.save();

        res.status(201).json({ message: "Annonce ajoutée avec succès." });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'annonce:", err);
        res.status(500).json({ message: err.message });
    }
});


// Route pour retirer une annonce de la liste des annonces listées
app.delete('/api/annonces/listed', async (req, res) => {
    try {
        const { id } = req.body;
        await ListedAnnonces.findByIdAndDelete(id);
        res.json({ message: "Annonce retirée avec succès." });
    } catch (err) {
        console.error("Erreur lors du retrait de l'annonce:", err);
        res.status(500).json({ message: err.message });
    }
});

// Routes restantes inchangées...


// Route pour associer une catégorie à une annonce
app.post('/api/annonces/category', async (req, res) => {
    try {
        const { id, category } = req.body;
        
        // Mettre à jour l'annonce avec la catégorie sélectionnée
        const annonce = await AnnoncesGlobale.findByIdAndUpdate(id, { category }, { new: true });
        if (!annonce) {
            return res.status(404).json({ message: "Annonce non trouvée." });
        }

        res.status(200).json({ message: "Catégorie ajoutée avec succès." });
    } catch (err) {
        console.error("Erreur lors de l'ajout de la catégorie:", err);
        res.status(500).json({ message: err.message });
    }
});



// Route pour récupérer les annonces visibles
app.get('/api/annonces', async (req, res) => {
    try {
        
        let annonces = await AnnoncesGlobale.find();
        // console.log("Annonces récupérés : ", annonces);
        res.json({annonces});
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
app.get('/api/annonces/hidden', async (req, res) => {
    try {
        let annoncesCachees = await AnnoncesGlobale.find({ toDisplay: false });
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
