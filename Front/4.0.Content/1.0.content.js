function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "20px";
    notification.style.backgroundColor = "#4caf50"; // Vert pour succès
    notification.style.color = "#fff";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    notification.style.fontSize = "16px";
    notification.style.zIndex = "1000";
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease-in-out";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 1000);
}

let minBudget = 0;
let maxBudget = 1000000000;
let minSurface = 0; 
let maxSurface = 1000000;
let minNbPieces = 0; 
let maxNbPieces = 1000000;
let selectedCategories = [];


function loadAnnonces(BudgetMin = 0, BudgetMax = 1000000000, SurfaceMin = 0, SurfaceMax = 1000000, NbPiecesMin = 0, NbPiecesMax = 1000, categories = [], sortOrder = 'asc') {
    fetch(`http://localhost:5000/api/annonces`)

        .then(response => response.json())
        .then(data => {
            let annoncesMasquees = JSON.parse(localStorage.getItem('annoncesMasquees')) || [];

            let filteredAnnonces = data.annonces.filter(annonce => {                
                let prixAnnonce = annonce.Prix;
                let surfaceAnnonce = parseFloat(annonce.Surface.replace('m²', '')); 
                let nbPiecesAnnonce = parseInt(annonce.NombreDePieces); 
                let firstWord = annonce.TypeDeBien.split(" ")[0];

                // Filtrer les annonces masquées
                return annonce.ToDisplay &&
                    prixAnnonce >= BudgetMin && prixAnnonce <= BudgetMax &&
                    surfaceAnnonce >= SurfaceMin && surfaceAnnonce <= SurfaceMax &&
                    nbPiecesAnnonce >= NbPiecesMin && nbPiecesAnnonce <= NbPiecesMax &&
                    (categories.length === 0 || categories.includes(firstWord)) &&
                    !annoncesMasquees.includes(annonce.id);  // Exclure les annonces masquées
            });

            // Tri des annonces selon la sélection
            if (sortOrder === "PrixCroissant") {
                filteredAnnonces.sort((a, b) => a.Prix - b.Prix);
            } else if (sortOrder === "PrixDecroissant") {
                filteredAnnonces.sort((a, b) => b.Prix - a.Prix);
            } else if (sortOrder === "SurfaceCroissante") {
                filteredAnnonces.sort((a, b) => {
                    let surfaceA = parseFloat(a.Surface.replace('m²', ''));
                    let surfaceB = parseFloat(b.Surface.replace('m²', ''));
                    return surfaceA - surfaceB;
                });
            } else if (sortOrder === "SurfaceDecroissante") {
                filteredAnnonces.sort((a, b) => {
                    let surfaceA = parseFloat(a.Surface.replace('m²', ''));
                    let surfaceB = parseFloat(b.Surface.replace('m²', ''));
                    return surfaceB - surfaceA;
                });
            } else if (sortOrder === "DatesAnciennes" || sortOrder === "DatesRecentes") {
                filteredAnnonces.sort((a, b) => {
                    const dateA = new Date(a.DateAjoutReperImmo);
                    const dateB = new Date(b.DateAjoutReperImmo);
                    return sortOrder === "DatesAnciennes" ? dateA - dateB : dateB - dateA;
                });
            }

            // Affichage des annonces
            const contentDiv = document.querySelector(".Content");
            contentDiv.innerHTML = "";
            contentDiv.style.display = "flex";
            contentDiv.style.flexWrap = "wrap";
            contentDiv.style.justifyContent = "center";
            contentDiv.style.alignItems = "flex-start";
            contentDiv.style.overflowY = "scroll";
            contentDiv.style.height = "calc(100vh - 99px)";
            contentDiv.style.gap = "20px";
            contentDiv.style.padding = "20px";

            filteredAnnonces.forEach(annonce => {
                console.log(annonce);
                
                const annonceDiv = document.createElement("div");
                annonceDiv.classList.add("annonce-card");

                // Ajout de style pour chaque annonce
                annonceDiv.style.border = "1px solid #ddd";
                annonceDiv.style.borderRadius = "10px";
                annonceDiv.style.overflow = "hidden";
                annonceDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                annonceDiv.style.width = "300px";
                annonceDiv.style.transition = "transform 0.3s";
                annonceDiv.style.backgroundColor = "#fff";
                annonceDiv.style.display = "flex";
                annonceDiv.style.flexDirection = "column";


                // Création de l'image
                let image = document.createElement('img');
                image.src = annonce.Image;
                image.alt = "Image de l'annonce";
                image.style.width = "100%";
                image.style.height = "180px";
                image.style.objectFit = "cover";
                image.style.borderBottom = "1px solid #ddd";

                // Ajout de l'image à l'annonceDiv
                annonceDiv.appendChild(image);

                // Création du conteneur pour le texte
                let textContainer = document.createElement('div');
                textContainer.style.flexGrow = "1";
                textContainer.style.display = "flex";
                textContainer.style.flexDirection = "column";
                textContainer.style.justifyContent = "space-between";

                // Première ligne : Prix + boutons
                let priceLine = document.createElement('div');
                priceLine.style.display = "flex";
                priceLine.style.justifyContent = "space-between";
                priceLine.style.padding = "5px 15px";
                let price = document.createElement('h2');

                let prixEntier = parseInt(annonce.Prix.replace('€', '').trim());
                let prixFormate = prixEntier.toLocaleString('fr-FR');
                
                price.innerHTML = `${prixFormate} €`;
                price.style.color = "#000000";
                

                let buttonContainer = document.createElement('div');
                buttonContainer.style.display = "flex";
                buttonContainer.style.gap = "10px";

                let plusButton = document.createElement('button');
                plusButton.textContent = "+";
                plusButton.style.backgroundColor = "#28a745"; 
                plusButton.style.color = "#fff"; 
                plusButton.style.border = "none";
                plusButton.style.borderRadius = "5px";
                plusButton.style.padding = "5px";

                let closeButton = document.createElement('button');
                closeButton.textContent = "X";
                closeButton.style.backgroundColor = "#dc3545";
                closeButton.style.color = "#fff";
                closeButton.style.border = "none";
                closeButton.style.borderRadius = "5px";
                closeButton.style.padding = "5px";

                priceLine.appendChild(price);
                priceLine.appendChild(buttonContainer);

                // Deuxième ligne : Surface + Nombre de pièces
                let detailsLine = document.createElement('div');
                detailsLine.style.display = "flex";
                detailsLine.style.justifyContent = "space-between";
                detailsLine.style.padding = "5px 15px";

                let surface = document.createElement('p');
                surface.innerHTML = `${annonce.Surface}`;
                surface.style.color = "#666";

                let rooms = document.createElement('p');
                rooms.innerHTML = `${annonce.NombreDePieces}`;
                rooms.style.color = "#666";

                detailsLine.appendChild(surface);
                detailsLine.appendChild(rooms);

                // Troisième ligne : Conteneur pour Type de bien et DateAjoutReperImmo
                let typeLineContainer = document.createElement('div');
                typeLineContainer.style.display = "flex";
                typeLineContainer.style.justifyContent = "space-between";
                typeLineContainer.style.alignItems = "center"; // Pour centrer verticalement
                typeLineContainer.style.padding = "5px 15px";

                // Élément pour le type de bien
                let typeDeBien = document.createElement('p');
                typeDeBien.textContent = annonce.TypeDeBien;
                typeDeBien.style.fontSize = "18px";
                typeDeBien.style.color = "#333";
                typeDeBien.style.marginBottom = "10px";

                // Élément pour la date d'ajout
                let dateAjout = document.createElement('p');
                dateAjout.textContent = `Ajouté le ${new Date(annonce.DateAjoutReperImmo).toLocaleDateString('fr-FR')}`;
                dateAjout.style.fontSize = "14px";
                dateAjout.style.color = "#666";
                dateAjout.style.marginBottom = "10px";

                // Ajout des éléments dans le conteneur
                typeLineContainer.appendChild(typeDeBien);
                typeLineContainer.appendChild(dateAjout);

                // Ajout des éléments texte au conteneur
                textContainer.appendChild(priceLine);
                textContainer.appendChild(detailsLine);
                textContainer.appendChild(typeLineContainer);

                let viewButton = document.createElement("button");
                viewButton.innerText = "Voir l'annonce";
                viewButton.style.border = "None"
                viewButton.style.height = "40px"
                viewButton.style.backgroundColor = "#0000FF"
                viewButton.style.color = "#fff"

                // Ajout d'un événement de clic pour rediriger vers le lien de l'annonce
                viewButton.addEventListener('click', () => {
                    window.open(annonce.LienAnnonce, '_blank');
                });

                textContainer.append(viewButton)

                // Ajout du conteneur texte à l'annonceDiv
                annonceDiv.appendChild(textContainer);

                // Ajout de l'annonce à l'élément parent (contentDiv)
                contentDiv.appendChild(annonceDiv);
            });

            // Affichage du nombre d'annonces
            const nombreAnnonces = document.createElement("p");
            nombreAnnonces.style.width = "100%";
            nombreAnnonces.style.fontSize = "18px";
            nombreAnnonces.style.fontWeight = "bold";
            nombreAnnonces.style.textAlign = "center";
            nombreAnnonces.style.marginBottom = "20px";
            nombreAnnonces.innerText = `Nombre d'annonces : ${filteredAnnonces.length}`;
            contentDiv.prepend(nombreAnnonces);
        })
        .catch(error => console.error("Erreur lors du chargement des annonces:", error));
}


function updateSelectedCategories() {
    selectedCategories = [];
    document.querySelectorAll("input[name='category']:checked").forEach((checkbox) => {
        selectedCategories.push(checkbox.value);
    });
    loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
}

function filtres() {
    let minPriceInput = document.querySelector("#minPrice");
    let maxPriceInput = document.querySelector("#maxPrice");

    if (minPriceInput && maxPriceInput) {
        minPriceInput.addEventListener("change", (e) => {
            minBudget = parseFloat(e.target.value) || 0;
            loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
        });

        maxPriceInput.addEventListener("change", (e) => {
            maxBudget = parseFloat(e.target.value) || 1000000000;
            loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
        });
    }

    let minSurfaceInput = document.querySelector("#minSurface");
    let maxSurfaceInput = document.querySelector("#maxSurface");

    if (minSurfaceInput && maxSurfaceInput) {
        minSurfaceInput.addEventListener("change", (e) => {
            minSurface = parseFloat(e.target.value) || 0;
            loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
        });

        maxSurfaceInput.addEventListener("change", (e) => {
            maxSurface = parseFloat(e.target.value) || 1000000;
            loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
        });
    }

    let minNbPieceInput = document.querySelector("#minNbPiece");
    let maxNbPieceInput = document.querySelector("#maxNbPiece");

    if (minNbPieceInput && maxNbPieceInput) {
        minNbPieceInput.addEventListener("change", (e) => {
            minNbPieces = parseFloat(e.target.value) || 0;
            loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
        });

        maxNbPieceInput.addEventListener("change", (e) => {
            maxNbPieces = parseFloat(e.target.value) || 1000000;
            loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories);
        });
    }

    document.querySelectorAll("input[name='category']").forEach((checkbox) => {
        checkbox.addEventListener("change", updateSelectedCategories);
    });

    document.querySelector("#sortOrder").addEventListener("change", (event) => {
        const selectedSortOrder = event.target.value;
        loadAnnonces(minBudget, maxBudget, minSurface, maxSurface, minNbPieces, maxNbPieces, selectedCategories, selectedSortOrder);
    });
}