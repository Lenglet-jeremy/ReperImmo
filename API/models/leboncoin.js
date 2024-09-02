const mongoose = require('mongoose');

// Schéma pour les annonces Leboncoin
const leboncoinGlobaleSchema = new mongoose.Schema({
    LienAnnonce: { type: String, default: "" },
    Image: { type: String, default: "" },
    Prix: { type: String, default: "" },
    PrixAuMCarre: { type: String, default: "" },
    Description: { type: String, default: "" },
    ProOuNon: { type: String, default: "" },
    Localisation: { type: String, default: "" },
    LienAuteurAnnoce: { type: String, default: "" },
    LOGOAuteurAnnonce: { type: String, default: "" },
    IdentiteAuteurAnnonce: { type: String, default: "" },
    IdentiteAuteurAnnonce2: { type: String, default: "" },
    DateAjout: { type: String, default: "" },
    toDisplay: { type: Boolean, default: true }
}, { collection: 'Rennes' });


const LeboncoinGlobale = mongoose.model('Leboncoin', leboncoinGlobaleSchema);
module.exports = LeboncoinGlobale;

const LeboncoinAnnonceShema = new mongoose.Schema({
    LienAnnonce: { type: String, default: "" },
    Images: { type: Array, default: [] },
    Titre: { type: String, default: "" },
    Description1: { type: String, default: "" },
    Prix: { type: String, default: "" },
    PrixAuMCarre: { type: String, default: "" },
    Date: { type: String, default: "" },
    Decription2: { type: String, default: "" },
    TypeDeBien: { type: String, default: "" },
    SurfaceHabitable: { type: String, default: "" },
    SurfaceTotaleTerrain: { type: String, default: "" },
    NombreDePPieces: { type: String, default: "" },
    ClasseEnergetique: { type: String, default: "" },
    GES: { type: String, default: "" },
    Ascenceur: { type: Boolean, default: false },
    NbEtageImmeuble: { type: Number, default: 0 },
    NbPlaceParking: { type: Number, default: 0 },
    Exterieur: { type: String, default: "" },
    AnneeConstruction: { type: Number, default: 0 },
    ChargesCoproprieteAnnuelle: { type: String, default: "" },
    Caracteristique: { type: String, default: "" },
    NbChambres: { type: Number, default: 0 },
    HonorairesInclus: { type: Boolean, default: false },
    Reference: { type: String, default: "" },
    Adresse: { type: String, default: "" },
    AuteurAnnonce: { type: String, default: "" }
});

const LeboncoinAnnonce = mongoose.model('LeboncoinAnnonce', LeboncoinAnnonceShema);
// module.exports = LeboncoinAnnonce;
