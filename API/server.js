const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs'); // Importer le module fs pour manipuler les fichiers
const path = require('path'); // Importer path pour gérer les chemins de fichiers
require('dotenv').config();

const app = express();
const AnnoncesGlobale = require('./models/annoncesGlobale');
const ListedAnnonces = require('./models/ListedAnnonces');

// Middleware CORS
app.use(cors());

// Middleware JSON
app.use(express.json());

app.use((req, res, next) => {
    res.locals.nonce = Buffer.from(Math.random().toString()).toString('base64');
    next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, process.env.MONGO_OPTIONS)
.then(async () => {
        console.log('Connected to MongoDB');
        
        // Sauvegarder les données de la BDD dans le fichier JSON lors du démarrage
        await saveDataToJSON();
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Fonction pour vérifier et créer le dossier /data
const ensureDataFolderExists = () => {
    const dataFolderPath = path.join(__dirname, 'data'); // Obtenir le chemin du dossier /data
    if (!fs.existsSync(dataFolderPath)) { // Vérifier si le dossier n'existe pas
        fs.mkdirSync(dataFolderPath); // Créer le dossier
        console.log('Dossier /data créé.');
    }
};

// Fonction pour sauvegarder les données dans un fichier JSON
const saveDataToJSON = async () => {
    try {
        ensureDataFolderExists(); // Assurer que le dossier /data existe

        const allAnnonces = await AnnoncesGlobale.find();  // Récupérer toutes les annonces
        const dataPath = path.join(__dirname, 'data', 'everyDBData.json');  // Chemin du fichier JSON

        // Écrire les données dans le fichier
        fs.writeFileSync(dataPath, JSON.stringify(allAnnonces, null, 2), 'utf-8');
        console.log('Données sauvegardées dans everyDBData.json');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde des données dans le fichier JSON:', err);
    }
};

// Route pour récupérer les annonces listées
app.get('/api/annonces/listed', async (req, res) => {
    try {
        const annonces = await ListedAnnonces.find();
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
