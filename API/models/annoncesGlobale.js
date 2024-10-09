const mongoose = require('mongoose');

// Schéma pour les annonces Rennes
const AnnoncesSchema = new mongoose.Schema({
    LienAnnonce: { type: String, default: "" },
    Prix: { type: Number, default: 0 }, // Prix en tant que nombre
    Surface: { type: Number, default: 0 },
    PrixAuMCarre: { type: Number, default: 0 },
    NombreDePieces: { type: Number, default: 0 },
    TypeDeBien: { type: String, default: "" },
    Image: { type: String, default: "" },
    Pro: { type: Boolean, default: false }, // Pro par défaut à true
    ToDisplay: { type: Boolean, default: true }, // Valeur par défaut
}, { collection: 'Rennes' });

const AnnoncesGlobale = mongoose.model('Annonces', AnnoncesSchema);
module.exports = AnnoncesGlobale;
