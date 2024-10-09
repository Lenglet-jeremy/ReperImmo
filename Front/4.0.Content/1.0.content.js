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


function loadAnnonces(BudgetMin = 0, BudgetMax = Infinity, SurfaceMin = 0, SurfaceMax = Infinity, NbPiecesMin = 0, NbPiecesMax = Infinity, categories = [], sortOrder = 'asc') {
    fetch(`http://localhost:5000/api/annonces`)

        .then(response => response.json())
        .then(data => {
            let annoncesMasquees = JSON.parse(localStorage.getItem('annoncesMasquees')) || [];
        
            
            let filteredAnnonces = data.annonces.filter(annonce => {
                let prixAnnonce = annonce.Prix;
                let surfaceAnnonce = annonce.Surface;
                let nbPiecesAnnonce = annonce.NombreDePieces;
                let firstWord = annonce.TypeDeBien;
                let pro = annonce.Pro;
                

                // Filtrer les annonces masquées
                return annonce.ToDisplay &&
                    prixAnnonce >= BudgetMin && prixAnnonce <= BudgetMax &&
                    surfaceAnnonce >= SurfaceMin && surfaceAnnonce <= SurfaceMax &&
                    nbPiecesAnnonce >= NbPiecesMin && nbPiecesAnnonce <= NbPiecesMax &&
                    (categories.length === 0 || categories.includes(firstWord)) &&
                    !annoncesMasquees.includes(annonce.id);
            }); // Jouer avec les filtre pour afficher toutes les annon de base mais sans casser le filtre

            // Ajout du tri par prix au m²
            if (sortOrder === "PrixMCarreCroissant") {
                filteredAnnonces.sort((a, b) => a.PrixAuMCarre - b.PrixAuMCarre);
            } else if (sortOrder === "PrixMCarreDecroissant") {
                filteredAnnonces.sort((a, b) => b.PrixAuMCarre - a.PrixAuMCarre);
            } else if (sortOrder === "PrixCroissant") {
                filteredAnnonces.sort((a, b) => a.Prix - b.Prix);
            } else if (sortOrder === "PrixDecroissant") {
                filteredAnnonces.sort((a, b) => b.Prix - a.Prix);
            } else if (sortOrder === "SurfaceCroissante") {
                filteredAnnonces.sort((a, b) => a.Surface - b.Surface);
            } else if (sortOrder === "SurfaceDecroissante") {
                filteredAnnonces.sort((a, b) => b.Surface - a.Surface);
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
                
                
                const annonceDiv = document.createElement("div");
                annonceDiv.classList.add("annonce-card");

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
                const image = document.createElement('img');
                image.src = annonce.Image;
                image.alt = "Image de l'annonce";
                image.style.width = "100%";
                image.style.height = "180px";
                image.style.objectFit = "cover";
                image.style.borderBottom = "1px solid #ddd";
                annonceDiv.appendChild(image);

                // Conteneur texte
                const textContainer = document.createElement('div');
                textContainer.style.flexGrow = "1";
                textContainer.style.display = "flex";
                textContainer.style.flexDirection = "column";
                textContainer.style.justifyContent = "space-between";

                // Prix et boutons
                const priceLine = document.createElement('div');
                priceLine.style.display = "flex";
                priceLine.style.padding = "5px";

                // Prix principal
                const price = document.createElement('h2');
                price.innerHTML = `${Number(annonce.Prix).toLocaleString('fr-FR')} €`;
                price.style.color = "#000000";
                price.style.margin = "0";  // Pour éviter tout margin par défaut

                // Conteneur pour le prix au m² et "FAI"
                const pricePerSquareMeterContainer = document.createElement('div');
                pricePerSquareMeterContainer.style.display = "flex";
                pricePerSquareMeterContainer.style.alignItems = "center";
                pricePerSquareMeterContainer.style.gap = "5px";  // Espace entre prix et FAI

                // Prix au mètre carré
                const pricePerSquareMeter = document.createElement('p');
                pricePerSquareMeter.innerHTML = `${Number(annonce.PrixAuMCarre).toLocaleString('fr-FR')} €/m²`;
                pricePerSquareMeter.style.fontSize = "0.8em";  // Plus petit que le prix principal
                pricePerSquareMeter.style.color = "#666";

                // Mention FAI si Pro === true
                if (annonce.Pro === true) {
                    const faiElement = document.createElement('span');
                    faiElement.innerHTML = "FAI";
                    faiElement.style.fontSize = "0.8em";
                    faiElement.style.color = "#666";
                    pricePerSquareMeterContainer.appendChild(pricePerSquareMeter);
                    pricePerSquareMeterContainer.appendChild(faiElement);
                } else {
                    pricePerSquareMeterContainer.appendChild(pricePerSquareMeter);
                }

                // Appliquer un style "flex" aligné à gauche
                priceLine.style.display = "flex";
                priceLine.style.alignItems = "center";  // Aligner verticalement au centre
                priceLine.style.gap = "5px";  // Ajouter un petit espace entre le prix et le prix au m²

                // Ajouter les deux éléments dans priceLine
                priceLine.appendChild(price);
                priceLine.appendChild(pricePerSquareMeterContainer);



                // Surface et nombre de pièces
                const detailsLine = document.createElement('div');
                detailsLine.style.display = "flex";
                detailsLine.style.justifyContent = "space-between";
                detailsLine.style.padding = "5px 15px";

                const surface = document.createElement('p');
                surface.innerHTML = `${annonce.Surface} m²`;
                surface.style.color = "#666";

                const rooms = document.createElement('p');
                rooms.innerHTML = `${annonce.NombreDePieces} pièces`;
                rooms.style.color = "#666";

                detailsLine.appendChild(surface);
                detailsLine.appendChild(rooms);

                // Type de bien et date
                const typeLineContainer = document.createElement('div');
                typeLineContainer.style.display = "flex";
                typeLineContainer.style.justifyContent = "space-between";
                typeLineContainer.style.padding = "5px 15px";

                const typeDeBien = document.createElement('p');
                typeDeBien.textContent = annonce.TypeDeBien;
                typeDeBien.style.fontSize = "18px";
                typeDeBien.style.color = "#333";

                const dateAjout = document.createElement('p');
                dateAjout.textContent = `Ajouté le ${new Date(annonce.DateAjoutReperImmo).toLocaleDateString('fr-FR')}`;
                dateAjout.style.fontSize = "14px";
                dateAjout.style.color = "#666";

                typeLineContainer.appendChild(typeDeBien);
                typeLineContainer.appendChild(dateAjout);

                textContainer.appendChild(priceLine);
                textContainer.appendChild(detailsLine);
                textContainer.appendChild(typeLineContainer);

                // Bouton pour voir l'annonce
                const viewButton = document.createElement("button");
                viewButton.innerText = "Voir l'annonce";
                viewButton.style.border = "None";
                viewButton.style.height = "40px";
                viewButton.style.backgroundColor = "#0000FF";
                viewButton.style.color = "#fff";

                viewButton.addEventListener('click', () => {
                    window.open(annonce.LienAnnonce, '_blank');
                });

                textContainer.appendChild(viewButton);

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