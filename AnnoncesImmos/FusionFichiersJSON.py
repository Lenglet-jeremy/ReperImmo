import os
import json
import re
from datetime import datetime, timedelta

dossier_sortie = "AnnoncesFusionnees"
Remplacement = {
    # leboncoin
    "groupadcard_lien": "LienAnnonce",
    "image": "Image0",
    "URL": "Image1",

    "like": "Prix",
    "flex": "PrixAuMCarre",

    "lineclampmaxlines": "Description0",
    "Champ12": "Description1",
    "Titre": "Description2",
    "Champ1": "Description3",
    "Champ2": "Description4",
    "Champ3": "Description5",

    "textcaption3": "DateAjout0",
    "Champ4": "DateAjout1",

    "textcaption": "Localisation0",
    "Champ13": "Localisation1",

    "flex_lien": "LienProfilAnnonceur",
    "image1": "ImageProfilAnnonceur",
    "lineclamp1": "IdentiteAnnonceur0",
    "lineclamp12": "IdentiteAnnonceur1",
    "Champ14": "IdentiteAnnonceur2",

    "boxborder": "ProOuNon",
    "Champ5": "TypeDeBien0",

    "Champ6": "SurfaceHabitable",
    "Champ7": "NombreDePieces",
    "Champ8": "Disponibilite",
    "Champ9": "HonorairesInclus",

    "Champ10": "Reference",
    "Champ11": "Criteres",
    
    # seloger    
    "sccfwelz_lien":"LienAnnonce",
    "prix_moyen_lien":"LienAnnonce",

    "image":"Image0",
    "image1":"Image1",
    "image7":"Image2",
    "image8":"Image3",

    # "Titre":"Prix",
    "scivveuv":"PrixAuMCarre",

    "schwchae_lien":"LienProfilAnnonceur",
    "scernlkl_lien":"LienAnnonceur",
    "scernlkl":"IdentiteAnnonceur0",

    "scdbaxsw":"TypeDeBien",

    "scdrctwm":"Description0",
    "scdrctwm2":"Description1",
    "scdrctwm3":"Description2",
    "scdrctwm4":"Description3",
    "scdrctwm5":"Description4",
    "scdrctwm6":"Description5",
    "scbvtasy":"Description6",

    "scdowztn":"Localisation0",
   
}


def est_annonce_vide(annonce):
    """
    Vérifie si une annonce est vide, c'est-à-dire si le "LienAnnonce", "Prix" et toutes les "DescriptionX" sont vides.
    """
    lien_annonce = annonce.get("LienAnnonce")
    prix = annonce.get("Prix")
    
    # Vérifier toutes les clés qui commencent par "Description"
    descriptions_vides = all(
        not annonce.get(f"Description{i}") for i in range(1, 6)  # Par exemple, Description1 à Description5
    )
    
    # Vérifier si "LienAnnonce", "Prix" ou toutes les "Descriptions" sont vides
    if not lien_annonce and not prix and descriptions_vides:
        return True
    return False

def nettoyer_type_de_bien(donnees):
    # Vérifier si la clé "TypeDeBien" est présente dans les données
    if "TypeDeBien" in donnees and isinstance(donnees["TypeDeBien"], str):
        # Séparer la chaîne de caractères par les sauts de ligne et prendre la dernière partie
        donnees["TypeDeBien"] = donnees["TypeDeBien"].split("\n")[-1].strip()
    return donnees


# Fonction pour remplacer les expressions de date et renvoyer la date trouvée
def remplacer_date_ajout(valeur):
    # Obtenir la date actuelle
    aujourd_hui = datetime.now()
    jour_semaine = aujourd_hui.weekday()

    # Définir les correspondances pour "hier", "aujourd'hui" et les jours de la semaine
    remplacements_dates = {
        r"aujourd'hui à (\d{1,2}h\d{1,2})?": aujourd_hui,
        r"hier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=1),
        r"lundi dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 7) % 7),
        r"mardi dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 8) % 7),
        r"mercredi dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 9) % 7),
        r"jeudi dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 10) % 7),
        r"vendredi dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 11) % 7),
        r"samedi dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 12) % 7),
        r"dimanche dernier à (\d{1,2}h\d{1,2})?": aujourd_hui - timedelta(days=(jour_semaine + 13) % 7),
    }


    for pattern, date_corres in remplacements_dates.items():
        match = re.search(pattern, valeur, re.IGNORECASE)
        if match:
            if match.group(1):
                heure = match.group(1).replace('h', ':')
                date_corres = date_corres.replace(hour=int(heure.split(':')[0]), minute=int(heure.split(':')[1]))
                return date_corres.strftime("%Y%m%d %H:%M")
            else:
                return date_corres.strftime("%Y%m%d")
    return None

# Fonction pour traiter les dates et ajouter "DateTrouvee"
def traiter_dates(donnees):
    cles_dates = ["DateAjout", "DateAjout2"]
    for cle in cles_dates:
        if cle in donnees and isinstance(donnees[cle], str):
            date_trouvee = remplacer_date_ajout(donnees[cle])
            if date_trouvee:
                donnees["DateTrouvee"] = date_trouvee
    return donnees

# Fonction pour réorganiser les clés dans le bon ordre
def reordonner_cles(donnees):
    if "Surface" in donnees and "NombreDePieces" in donnees:
        donnees_ordonnes = {}
        
        for cle, valeur in donnees.items():
            if cle == "Surface":
                donnees_ordonnes[cle] = valeur
                donnees_ordonnes["NombreDePieces"] = donnees["NombreDePieces"]
            elif cle != "NombreDePieces":
                donnees_ordonnes[cle] = valeur
                
        return donnees_ordonnes
    return donnees

# Fonction pour extraire la surface et le nombre de pièces, et ajouter des valeurs par défaut
def extraire_surface_et_pieces(donnees):
    surface_regex = r"(\d+(\.\d+)?)\s*(m²|m\s*²|m2|m\s*2|M²|M\s*²|M2|M\s*2)"
    pieces_regex = r"(\d+)\s*([pP][iI][eè]ces?|T\d)"


    surface = None
    pieces = None

    cles_a_verifier = ["Description0", "Description1", "Description2", "Description3", "Description4", "Description5", "SurfaceHabitable", "NombreDePieces"]

    for cle in cles_a_verifier:
        if cle in donnees:
            valeur = donnees[cle]
            if isinstance(valeur, str):
                surface_match = re.search(surface_regex, valeur)
                if surface_match:
                    surface = int(surface_match.group(1))

                pieces_match = re.search(pieces_regex, valeur)
                if pieces_match:
                    pieces = int(pieces_match.group(1))

    # Si la surface ou les pièces n'ont pas été trouvées, on ajoute une valeur par défaut de 0
    donnees["Surface"] = surface if surface is not None else 0
    donnees["NombreDePieces"] = pieces if pieces is not None else 0

    return donnees


# Fonction pour ajouter la date de traitement dans "DateAjoutReperimmo"
def ajouter_date_ajout_reperimmo(donnees):
    date_ajout_reperimmo = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    donnees["DateAjoutReperimmo"] = date_ajout_reperimmo
    return donnees

# Fonction pour extraire la première "ImageX" et créer la clé "Image"
def ajouter_cle_image(donnees):
    image_cle = ""
    # Parcourir toutes les clés pour trouver "ImageX" (où X est un chiffre entre 0 et 99)
    for i in range(100):
        cle_image = f"Image{i}"
        if cle_image in donnees and donnees[cle_image]:
            image_cle = donnees[cle_image]
            break
    
    # Ajouter la clé "Image" avec la première valeur trouvée ou une valeur vide
    donnees["Image"] = image_cle if image_cle else ""
    return donnees
import re

# Fonction pour extraire la valeur numérique du prix
def extraire_valeur_prix(valeur):
    # Si c'est une chaîne de caractères, extraire les nombres
    if isinstance(valeur, str):
        # Utiliser une expression régulière pour extraire les nombres
        match = re.search(r'(\d[\d\s]*\d)', valeur)
        if match:
            # Retirer les espaces entre les chiffres et retourner la valeur numérique
            return int(match.group(1).replace(" ", ""))
    # Si la valeur n'est pas une chaîne ou aucun nombre trouvé, on retourne la valeur d'origine
    return valeur

def extraire_type_de_bien(donnees):
    # Vérifier si "TypeDeBien0" existe
    if "TypeDeBien0" in donnees and isinstance(donnees["TypeDeBien0"], str):
        # Rechercher les deux sauts de ligne et prendre le texte qui suit
        sections = donnees["TypeDeBien0"].split("\n\n")
        if len(sections) > 1:
            # Prendre la première partie après les deux sauts de ligne et en extraire le premier mot
            premier_mot = sections[1].split()[0]
            donnees["TypeDeBien"] = premier_mot
    return donnees


def remplacer_cles(donnees, remplacement, source, fichier_source):
    if isinstance(donnees, dict):
        nouvelles_donnees = {}
        for cle, valeur in donnees.items():
            # Condition : Si la clé est "Titre" et que le fichier source contient "seloger" dans son nom
            if cle == "Titre" and "seloger" in fichier_source.lower():
                nouvelle_cle = "Prix"
                valeur = extraire_valeur_prix(valeur)  # Appliquer le traitement pour extraire la valeur numérique du prix
            else:
                nouvelle_cle = remplacement.get(cle, cle)
            
            if isinstance(valeur, (dict, list)):
                valeur = remplacer_cles(valeur, remplacement, source, fichier_source)
                
            nouvelles_donnees[nouvelle_cle] = valeur

        # Extraire la valeur "TypeDeBien" en fonction de "TypeDeBien0"
        nouvelles_donnees = extraire_type_de_bien(nouvelles_donnees)

        # Ajouter la clé "fichierSource" avec le nom du fichier source
        nouvelles_donnees["fichierSource"] = fichier_source

        # Ajouter les autres champs traités
        nouvelles_donnees = traiter_dates(nouvelles_donnees)
        nouvelles_donnees = extraire_surface_et_pieces(nouvelles_donnees)
        nouvelles_donnees = ajouter_date_ajout_reperimmo(nouvelles_donnees)
        nouvelles_donnees = ajouter_cle_image(nouvelles_donnees)

        nouvelles_donnees["source"] = source
        nouvelles_donnees["toDisplay"] = True

        # Réorganiser les clés pour placer "NombreDePieces" après "Surface"
        nouvelles_donnees = reordonner_cles(nouvelles_donnees)

        return nouvelles_donnees
    elif isinstance(donnees, list):
        return [remplacer_cles(item, remplacement, source, fichier_source) for item in donnees]
    else:
        return donnees


# Fonction pour fusionner deux dictionnaires
def fusionner_dicts(existant, nouveau):
    for cle, valeur in nouveau.items():
        # Si la clé n'existe pas dans le dictionnaire existant, on l'ajoute
        if cle not in existant:
            existant[cle] = valeur
    return existant

# Créer le sous-dossier AnnoncesFusionnees/ s'il n'existe pas
if not os.path.exists(dossier_sortie):
    os.makedirs(dossier_sortie)

# Chemin du fichier global
fichier_sortie_global = os.path.join(dossier_sortie, "AnnoncesFusionnees.json")

# Obtenir la liste de tous les fichiers JSON dans le dossier courant
fichiers_json = [fichier for fichier in os.listdir() if fichier.endswith('.json')]

# Charger les données existantes dans le fichier global, s'il existe déjà
if os.path.exists(fichier_sortie_global):
    with open(fichier_sortie_global, 'r', encoding='utf-8') as f:
        donnees_fusionnees = json.load(f)
else:
    donnees_fusionnees = []  # Initialiser une liste vide si le fichier n'existe pas

# Créer un dictionnaire basé sur 'LienAnnonce' pour une recherche rapide
index_lien_annonce = {item.get("LienAnnonce"): item for item in donnees_fusionnees if "LienAnnonce" in item}

# Liste pour stocker les nouvelles annonces
nouvelles_annonces = []

# Traiter chaque fichier JSON
for fichier_json in fichiers_json:
    # Utiliser le nom complet du fichier comme fichierSource
    fichier_source = fichier_json
    
    # Extraire la source du nom de fichier (avant la date YYYYMMJJ)
    source_match = re.match(r"(.+?)\d{8}\.json", fichier_json)
    if source_match:
        source = source_match.group(1)
    else:
        source = "inconnue"  # Valeur par défaut si le format du fichier est incorrect

    # Lire le fichier JSON d'entrée
    with open(fichier_json, 'r', encoding='utf-8') as f:
        donnees = json.load(f)

    # Remplacer les clés et ajouter "source" et "fichierSource"
    nouvelles_donnees = remplacer_cles(donnees, Remplacement, source, fichier_source)

    # Si c'est une liste, on traite chaque élément
    if isinstance(nouvelles_donnees, list):
        for nouvelle_donnee in nouvelles_donnees:
            # Vérifier si l'annonce est vide
            if est_annonce_vide(nouvelle_donnee):
                continue  # Ne pas ajouter l'annonce si elle est vide

            lien_annonce = nouvelle_donnee.get("LienAnnonce")
            fichier_source_annonce = nouvelle_donnee.get("fichierSource")
            
            # Vérifier si l'annonce avec le même "LienAnnonce" et "fichierSource" existe déjà
            if lien_annonce and fichier_source_annonce:
                annonce_existe = any(
                    item.get("LienAnnonce") == lien_annonce and 
                    item.get("fichierSource") == fichier_source_annonce
                    for item in donnees_fusionnees
                )
                if not annonce_existe:
                    donnees_fusionnees.append(nouvelle_donnee)
                    nouvelles_annonces.append(nouvelle_donnee)
            else:
                donnees_fusionnees.append(nouvelle_donnee)
                nouvelles_annonces.append(nouvelle_donnee)
    else:
        # Si c'est un seul objet
        if est_annonce_vide(nouvelles_donnees):
            continue  # Ne pas ajouter l'annonce si elle est vide
        
        lien_annonce = nouvelles_donnees.get("LienAnnonce")
        fichier_source_annonce = nouvelles_donnees.get("fichierSource")
        
        if lien_annonce and fichier_source_annonce:
            annonce_existe = any(
                item.get("LienAnnonce") == lien_annonce and 
                item.get("fichierSource") == fichier_source_annonce
                for item in donnees_fusionnees
            )
            if not annonce_existe:
                donnees_fusionnees.append(nouvelles_donnees)
                nouvelles_annonces.append(nouvelles_donnees)
        else:
            donnees_fusionnees.append(nouvelles_donnees)
            nouvelles_annonces.append(nouvelles_donnees)


# Écrire les données fusionnées dans le fichier global
with open(fichier_sortie_global, 'w', encoding='utf-8') as f:
    json.dump(donnees_fusionnees, f, ensure_ascii=False, indent=4)

# Si des nouvelles annonces existent, générer le fichier avec horodatage
if nouvelles_annonces:
    # Obtenir l'horodatage actuel et formater selon 'YYYYMMJJ_HHhMMmSSs'
    horodatage = datetime.now().strftime("%Y%m%d_%Hh%Mm%Ss")
    fichier_sortie_nouvelles = os.path.join(dossier_sortie, f"NouvellesAnnonces_{horodatage}.json")

    # Écrire les nouvelles annonces dans un fichier avec l'horodatage
    with open(fichier_sortie_nouvelles, 'w', encoding='utf-8') as f:
        json.dump(nouvelles_annonces, f, ensure_ascii=False, indent=4)

else:
    print("Aucune nouvelle annonce à ajouter.")

# Afficher le nombre total de collections dans le fichier global
nombre_total_annonces = len(donnees_fusionnees)
print(f"Nombre total d'annonces dans le fichier global : {nombre_total_annonces}")

# Afficher le nombre d'annonces ajoutées depuis la dernière exécution
nombre_nouvelles_annonces = len(nouvelles_annonces)
print(f"Nombre d'annonces ajoutées depuis la dernière exécution : {nombre_nouvelles_annonces}")
