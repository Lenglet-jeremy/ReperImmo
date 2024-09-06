const mongoose = require('mongoose');

// Schéma pour les annonces Leboncoin
const Annonces = new mongoose.Schema({
    LienAnnonce: { type: String, default: "" },
    Image: { type: String, default: "" },
    Prix: { type: String, default: "" },
    PrixAuMCarre: { type: String, default: "" },
    Description: { type: String, default: "" },
    ProOuNon: { type: String, default: "" },
    Localisation: { type: String, default: "" },
    LienAuteurAnnonce: { type: String, default: "" },
    LOGOAuteurAnnonce: { type: String, default: "" },
    IdentiteAuteurAnnonce: { type: String, default: "" },
    IdentiteAuteurAnnonce2: { type: String, default: "" },
    DateAjoutLBC: { type: String, default: "" },
    DateAjoutReperimmo: { type: String, default: "" },
    toDisplay: { type: Boolean, default: true }
}, { collection: 'Rennes' });


const AnnoncesGlobale = mongoose.model('Leboncoin', Annonces);
module.exports = AnnoncesGlobale;
