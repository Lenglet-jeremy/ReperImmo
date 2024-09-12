const mongoose = require('mongoose');

// Schéma pour les annonces Leboncoin
const Annonces = new mongoose.Schema({
    LienAnnonce: { type: String, default: "" },
    Prix: { type: String, default: "" },
    Image: { type: String, default: "" },
    PrixAuMCarre: { type: String, default: "" },
    TypeDeBien: { type: String, default: "" },
    toDisplay: { type: Boolean, default: true }, 
}, { collection: 'Rennes' });



const AnnoncesGlobale = mongoose.model('Leboncoin', Annonces);
module.exports = AnnoncesGlobale;