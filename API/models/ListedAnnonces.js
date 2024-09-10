const mongoose = require('mongoose');

const ListedAnnoncesSchema = new mongoose.Schema({
    // Reprend la structure du modèle AnnoncesGlobale
    title: String,
    image: String,
    // Ajoutez les autres champs nécessaires ici
});

module.exports = mongoose.model('ListedAnnonces', ListedAnnoncesSchema);
