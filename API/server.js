const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const AnnoncesGlobale = require('./models/annoncesGlobale');
const ListedAnnonces = require('./models/ListedAnnonces');

// Middleware de sécurité
app.use(helmet());

// Middleware CORS
app.use(cors({
    origin: 'https://reperimmo.netlify.app',  // Ajustez cette URL si nécessaire
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../Front')));

// Middleware JSON
app.use(express.json());

// Générateur de nonce pour chaque requête
app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(Date.now().toString()).toString('base64');
    next();
});

// Helmet avec Content-Security-Policy, utilisant des nonce pour les scripts et styles inline
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://reperimmo-98b01b670620.herokuapp.com", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "https://reperimmo-98b01b670620.herokuapp.com", (req, res) => `'nonce-${res.locals.nonce}'`],
        imgSrc: ["'self'", "data:", "https://reperimmo-98b01b670620.herokuapp.com"],
        connectSrc: ["'self'", "https://reperimmo-98b01b670620.herokuapp.com"],
        upgradeInsecureRequests: [],
    },
    noSniff: true,  // Pour résoudre le problème avec le type MIME
}));

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
        res.status(500).json({ message: err.message });
    }
});

// Route pour ajouter une annonce
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
        res.status(500).json({ message: err.message });
    }
});

// Route pour supprimer une annonce
app.delete('/api/annonces/listed', async (req, res) => {
    try {
        const { id } = req.body;
        await ListedAnnonces.findByIdAndDelete(id);
        res.json({ message: "Annonce retirée avec succès." });
    } catch (err) {
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
        res.status(500).json({ message: err.message });
    }
});

// Lancer le serveur sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
