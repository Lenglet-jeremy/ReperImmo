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

// Tableau pour stocker les catégories sélectionnées
let selectedCategories = [];

// Fonction pour gérer les catégories sélectionnées
function updateSelectedCategories() {
    selectedCategories = []; // Vider le tableau à chaque mise à jour

    // Récupérer toutes les cases à cocher avec le nom "category"
    document.querySelectorAll("input[name='category']:checked").forEach((checkbox) => {
        selectedCategories.push(checkbox.value); // Ajouter la catégorie sélectionnée
    });

    // Recharger les annonces avec les nouvelles catégories sélectionnées
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

    // Ajout des événements sur les checkboxes des catégories
    document.querySelectorAll("input[name='category']").forEach((checkbox) => {
        checkbox.addEventListener("change", updateSelectedCategories); // Mise à jour des catégories à chaque changement
    });
}

function loadAnnonces(BudgetMin = 0, BudgetMax = 1000000000, SurfaceMin = 0, SurfaceMax = 1000000, NbPiecesMin = 0, NbPiecesMax = 1000, categories = []) {
    fetch(`http://localhost:5000/api/annonces`)
        .then(response => response.json())
        .then(data => {
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

            data.annonces.forEach(annonce => {
                let prixAnnonce = annonce.Prix;
                if (typeof prixAnnonce === 'string') {
                    prixAnnonce = parseFloat(prixAnnonce.replace(/[^\d.-]/g, '')); // Retirer tout sauf les chiffres, les points et les tirets
                }


                let surfaceAnnonce = annonce.Surface;
                let nbPiecesAnnonce = annonce.NombreDePieces;

                // Extraire le premier mot de TypeDeBien
                let firstWord = annonce.TypeDeBien.split(" ")[0]; 
                console.log(firstWord);
                


                // Vérifiez si l'annonce correspond à une des catégories sélectionnées
                if (annonce.toDisplay &&
                    prixAnnonce >= BudgetMin && prixAnnonce <= BudgetMax &&
                    surfaceAnnonce >= SurfaceMin && surfaceAnnonce <= SurfaceMax &&
                    nbPiecesAnnonce >= NbPiecesMin && nbPiecesAnnonce <= NbPiecesMax &&
                    (categories.length === 0 || categories.includes(firstWord))) { // Utiliser le premier mot pour le filtre
                        
                    const annonceDiv = document.createElement("div");
                    annonceDiv.classList.add("annonce");
                    annonceDiv.style.backgroundColor = "#000000";
                    annonceDiv.style.display = "flex";
                    annonceDiv.style.flexDirection = "column";
                    annonceDiv.style.border = "1px solid #ddd";
                    annonceDiv.style.borderRadius = "8px";
                    annonceDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                    annonceDiv.style.width = "400px";
                    annonceDiv.style.height = "400px";
                    annonceDiv.style.overflow = "hidden";
                    annonceDiv.style.transition = "transform 0.2s ease-in-out";
                    annonceDiv.style.cursor = "pointer";
                    annonceDiv.style.position = "relative";

                    const img = document.createElement("img");
                    img.src = annonce.Image;
                    img.alt = "Image Annonce";
                    img.style.width = "100%";
                    img.style.height = "200px";
                    img.style.objectFit = "cover";
                    annonceDiv.appendChild(img);

                    const textContainer = document.createElement("div");
                    textContainer.style.padding = "0px 15px";
                    textContainer.style.flex = "1";

                    const rowContainer = document.createElement("div");
                    rowContainer.style.display = "flex";
                    rowContainer.style.justifyContent = "space-between";
                    rowContainer.style.alignItems = "center";
                    rowContainer.style.marginBottom = "10px";

                    const priceContainer = document.createElement("div");
                    priceContainer.style.display = "flex";
                    priceContainer.style.justifyContent = "space-between";
                    priceContainer.style.alignItems = "center";

                    const prix = document.createElement("h2");
                    prix.textContent = annonce.Prix;
                    prix.style.margin = "0";
                    prix.style.fontSize = "22px";
                    prix.style.fontWeight = "bold";
                    priceContainer.appendChild(prix);

                    if (annonce.PrixAuMCarre) {
                        const prixMCarre = document.createElement("p");
                        prixMCarre.textContent = `${annonce.PrixAuMCarre}`;
                        prixMCarre.style.margin = "0";
                        prixMCarre.style.fontSize = "14px";
                        prixMCarre.style.color = "#333";
                        prixMCarre.style.marginLeft = "10px";
                        priceContainer.appendChild(prixMCarre);
                    }

                    rowContainer.appendChild(priceContainer);

                    const buttonContainer = document.createElement("div");
                    buttonContainer.style.display = "flex";
                    buttonContainer.style.gap = "10px";

                    const addButton = document.createElement("span");
                    addButton.innerText = "+";
                    addButton.style.border = "1px solid #000000";
                    addButton.style.fontSize = "24px";
                    addButton.style.cursor = "pointer";
                    addButton.style.color = "#FF0000";
                    addButton.style.width = "30px";
                    addButton.style.height = "30px";
                    addButton.style.borderRadius = "15px";
                    addButton.style.display = "flex";
                    addButton.style.justifyContent = "center";
                    addButton.style.alignItems = "center";

                    addButton.addEventListener("click", () => {
                        fetch("http://localhost:5000/api/annonces/listed", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: annonce._id  // Assurez-vous de passer l'ID correct ici
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) {
                                console.log("Annonce ajoutée à la liste avec succès.");
                                showNotification("Annonce ajoutée à la liste !");
                            } else {
                                console.error("Erreur lors de l'ajout de l'annonce.");
                            }
                        })
                        .catch(error => console.error("Erreur lors de la requête:", error));
                    });
                    

                    buttonContainer.appendChild(addButton);

                    const hideButton = document.createElement("span");
                    hideButton.innerHTML = "&times;";
                    hideButton.style.border = "1px solid #000000";
                    hideButton.style.fontSize = "18px";
                    hideButton.style.cursor = "pointer";
                    hideButton.style.width = "30px";
                    hideButton.style.height = "30px";
                    hideButton.style.borderRadius = "15px";
                    hideButton.style.display = "flex";
                    hideButton.style.justifyContent = "center";
                    hideButton.style.alignItems = "center";

                    hideButton.addEventListener("click", () => {
                        annonceDiv.remove();

                        fetch(`http://localhost:5000/api/annonces/hide`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: annonce._id,
                                toDisplay: false
                            })
                        })
                        .then(response => {
                            if (!response.ok) {
                                console.error("Erreur lors de la mise à jour de l'annonce.");
                            }
                        })
                        .catch(error => console.error("Erreur lors de la requête:", error));
                    });

                    buttonContainer.appendChild(hideButton);

                    rowContainer.appendChild(buttonContainer);
                    textContainer.appendChild(rowContainer);

                    const detailsContainer = document.createElement("div");
                    detailsContainer.style.display = "flex";
                    detailsContainer.style.justifyContent = "space-between";
                    detailsContainer.style.alignItems = "center";
                    detailsContainer.style.marginBottom = "10px";

                    const surface = document.createElement("p");
                    surface.textContent = `Surface: ${annonce.Surface} m²`;
                    surface.style.fontSize = "16px";
                    surface.style.color = "#555";
                    detailsContainer.appendChild(surface);

                    const pieces = document.createElement("p");
                    pieces.textContent = `Nombre de pièces: ${annonce.NombreDePieces}`;
                    pieces.style.fontSize = "16px";
                    pieces.style.color = "#555";
                    detailsContainer.appendChild(pieces);

                    textContainer.appendChild(detailsContainer);

                    const description = document.createElement("p");
                    description.textContent = annonce.Description;
                    description.style.margin = "10px 0";
                    description.style.fontSize = "14px";
                    description.style.color = "#666";
                    description.style.overflow = "hidden";
                    description.style.textOverflow = "ellipsis";
                    description.style.display = "-webkit-box";
                    description.style.webkitLineClamp = "3";
                    description.style.webkitBoxOrient = "vertical";
                    textContainer.appendChild(description);

                    annonceDiv.appendChild(textContainer);

                    const viewButton = document.createElement("button");
                    viewButton.textContent = "Voir l'annonce";
                    viewButton.style.position = "absolute";
                    viewButton.style.bottom = "0";
                    viewButton.style.left = "0";
                    viewButton.style.right = "0";
                    viewButton.style.padding = "15px";
                    viewButton.style.fontSize = "16px";
                    viewButton.style.color = "#007BFF";
                    viewButton.style.backgroundColor = "#fff";
                    viewButton.style.border = "none";
                    viewButton.style.cursor = "pointer";
                    viewButton.style.width = "100%";
                    viewButton.style.borderTop = "1px solid #ddd";

                    viewButton.addEventListener("click", () => {
                        window.open(annonce.LienAnnonce, '_blank'); // Ouvre le lien dans un nouvel onglet
                    });
                    

                    annonceDiv.appendChild(viewButton);
                    // Affichage de l'ID de l'annonce en bas à gauche
                    const idContainer = document.createElement("div");
                    idContainer.textContent = `${annonce._id}`;  // Assurez-vous que l'ID de l'annonce est correct
                    idContainer.style.position = "absolute";
                    idContainer.style.bottom = "60px";
                    idContainer.style.left = "10px";
                    idContainer.style.fontSize = "12px";
                    idContainer.style.color = "#ffffff";  // Vous pouvez ajuster la couleur selon votre thème
                    idContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    idContainer.style.padding = "5px";
                    idContainer.style.borderRadius = "5px";

                    annonceDiv.appendChild(idContainer);

                    contentDiv.appendChild(annonceDiv);
                }
            });
        })
        .catch(error => console.error("Erreur lors du chargement des annonces:", error));
}
