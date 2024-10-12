const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const app = express();
const AnnoncesGlobale = require('./models/annoncesGlobale');
const ListedAnnonces = require('./models/ListedAnnonces');  
const helmet = require('helmet');
const path = require('path');  // Assurez-vous d'importer le module path

// Middleware pour la sécurité
app.use(helmet());

// Middleware pour permettre les requêtes cross-origin
app.use(cors({
    origin: 'https://reperimmo.netlify.app',  // Changez cela si nécessaire
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

app.get('*.css', (req, res, next) => {
    res.set('Content-Type', 'text/css');
    next();
});



app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://reperimmo-98b01b670620.herokuapp.com"],
        styleSrc: ["'self'", "https://reperimmo-98b01b670620.herokuapp.com"],
        imgSrc: ["'self'", "data:", "https://reperimmo-98b01b670620.herokuapp.com"],  // Autoriser les images externes si nécessaire
        objectSrc: ["'none'"],  // Désactive Flash, Java, autres objets intégrés
        upgradeInsecureRequests: [],  // Optionnel: force HTTPS
    },
}));



// Middleware pour servir des fichiers statiques à partir du dossier Front
app.use(express.static(path.join(__dirname, '../Front')));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/index.html')); 
});

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

        const annonceExistante = await ListedAnnonces.findOne({ _id: id });
        if (annonceExistante) {
            return res.status(400).json({ message: "L'annonce est déjà listée." });
        }

        const annonce = await AnnoncesGlobale.findById(id);
        if (!annonce) {
            return res.status(404).json({ message: "Annonce non trouvée." });
        }

        const newAnnonce = new ListedAnnonces({
            title: annonce.Titre,
            image: annonce.Image
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
        res.json({ annonces });
    } catch (err) {
        console.error('Erreur lors de la récupération des annonces:', err);
        res.status(500).json({ message: err.message });
    }
});

// Lancer le serveur sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
