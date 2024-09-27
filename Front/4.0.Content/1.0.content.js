const { log } = require("console");

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
            let filteredAnnonces = data.annonces.filter(annonce => {                
            let prixAnnonce = parseFloat((annonce.Prix0).replace(/[^\d.-]/g, ''));
            let surfaceAnnonce = annonce.Surface;
            let nbPiecesAnnonce = annonce.NombreDePieces;
            let firstWord = annonce.TypeDeBien.split(" ")[0];
            console.log(annonce.Prix0);
            

            return annonce.toDisplay &&
                prixAnnonce >= BudgetMin && prixAnnonce <= BudgetMax &&
                surfaceAnnonce >= SurfaceMin && surfaceAnnonce <= SurfaceMax &&
                nbPiecesAnnonce >= NbPiecesMin && nbPiecesAnnonce <= NbPiecesMax &&
                (categories.length === 0 || categories.includes(firstWord));
            });

            // Tri des annonces selon la sélection
            if (sortOrder === "PrixCroissant") {
                filteredAnnonces.sort((a, b) => {
                    let prixA = parseFloat(a.Prix.replace(/[^\d.-]/g, ''));
                    let prixB = parseFloat(b.Prix.replace(/[^\d.-]/g, ''));
                    return prixA - prixB;
                });
            } else if (sortOrder === "PrixDecroissant") {
                filteredAnnonces.sort((a, b) => {
                    let prixA = parseFloat(a.Prix.replace(/[^\d.-]/g, ''));
                    let prixB = parseFloat(b.Prix.replace(/[^\d.-]/g, ''));
                    return prixB - prixA;
                });
            } else if (sortOrder === "SurfaceCroissante") {
                filteredAnnonces.sort((a, b) => a.Surface - b.Surface);
            } else if (sortOrder === "SurfaceDecroissante") {
                filteredAnnonces.sort((a, b) => b.Surface - a.Surface);
            } else if (sortOrder === "PrixMCarreCroissant" || sortOrder === "PrixMCarreDecroissant") {
                filteredAnnonces.sort((a, b) => {
                    let prixM2A = a.PrixAuMCarre ? parseFloat(a.PrixAuMCarre.replace(/[^\d.-]/g, '')) : 0;
                    let prixM2B = b.PrixAuMCarre ? parseFloat(b.PrixAuMCarre.replace(/[^\d.-]/g, '')) : 0;
                    return sortOrder === "PrixMCarreCroissant" ? prixM2A - prixM2B : prixM2B - prixM2A;
                });
            } else if (sortOrder === "DatesAnciennes" || sortOrder === "DatesRecentes") {
                filteredAnnonces.sort((a, b) => {
                    const dateA = new Date(a.DateAjoutReperimmo);
                    const dateB = new Date(b.DateAjoutReperimmo);
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


            let nbAnnonces = 0
            filteredAnnonces.forEach(annonce => {
                let firstWord = annonce.TypeDeBien.split(" ")[0]; // Redéfinir ici
                nbAnnonces++
                
                let prixAnnonce = annonce.Prix0;
                let surfaceAnnonce = annonce.Surface;
                let nbPiecesAnnonce = annonce.NombreDePieces;

                // Vérification des conditions pour l'affichage des annonces
                if (annonce.toDisplay &&
                    prixAnnonce >= BudgetMin && prixAnnonce <= BudgetMax &&
                    surfaceAnnonce >= SurfaceMin && surfaceAnnonce <= SurfaceMax &&
                    nbPiecesAnnonce >= NbPiecesMin && nbPiecesAnnonce <= NbPiecesMax &&
                    (categories.length === 0 || categories.includes(firstWord))) {

                    const annonceDiv = document.createElement("div");
                    annonceDiv.classList.add("annonce");
                    annonceDiv.style.backgroundColor = "#FFFFFF";
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
                    img.src = annonce.Image0;
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
                    prix.textContent = `${prixAnnonce.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;
                    prix.style.margin = "0";
                    prix.style.fontSize = "22px";
                    prix.style.fontWeight = "bold";
                    priceContainer.appendChild(prix);
    
    
                    rowContainer.appendChild(priceContainer);
    
                    const buttonContainer = document.createElement("div");
                    buttonContainer.style.display = "flex";
                    buttonContainer.style.gap = "10px";

                    const addButton = document.createElement("span");
                    addButton.innerText = "+";
                    addButton.style.border = "1px solid #000000";
                    addButton.style.fontSize = "24px";
                    addButton.style.cursor = "pointer";
                    addButton.style.color = "#000000";
                    addButton.style.width = "30px";
                    addButton.style.height = "30px";
                    addButton.style.borderRadius = "15px";
                    addButton.style.display = "flex";
                    addButton.style.justifyContent = "center";
                    
                    buttonContainer.appendChild(addButton);

                    // Création du menu déroulant pour l'ajout dans un menu spécifique
                    const dropdownMenu = document.createElement("ul");
                    dropdownMenu.style.position = "absolute";
                    dropdownMenu.style.top = "40px"; // juste en dessous du bouton "+"
                    dropdownMenu.style.left = "0";
                    dropdownMenu.style.backgroundColor = "#fff";
                    dropdownMenu.style.border = "1px solid #ddd";
                    dropdownMenu.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                    dropdownMenu.style.display = "none"; // le menu est caché par défaut
                    dropdownMenu.style.listStyle = "none";
                    dropdownMenu.style.width = "150px";
                    dropdownMenu.style.zIndex = "1000";
                    dropdownMenu.style.borderRadius = "5px";

                    // Charger les menus disponibles depuis les onglets et les afficher dans le menu déroulant
                    const tabsAndMenus = getTabsAndMenus();

                    // Add the menus to the dropdown menu
                    tabsAndMenus.forEach(tab => {
                        tab.menus.forEach(menu => {
                            const menuItem = document.createElement("li");
                            menuItem.style.padding = "8px";
                            menuItem.style.cursor = "pointer";
                            menuItem.style.color = "#000000";
                            menuItem.style.fontSize = "18px";
                            menuItem.style.border = "1px solid #000000";
                            menuItem.textContent = menu;

                            // Add an event listener to add the announcement to the selected menu
                            menuItem.addEventListener("click", () => {
                                // Add the announcement to the selected menu
                                const annoncesMenu = JSON.parse(localStorage.getItem(menu)) || [];
                                annoncesMenu.push(annonce);
                                localStorage.setItem(menu, JSON.stringify(annoncesMenu));

                                // Hide the dropdown menu
                                dropdownMenu.style.display = "none";

                                // Show a notification
                                showNotification(`Annonce ajoutée à ${menu}`);
                            });

                            dropdownMenu.appendChild(menuItem);
                        });
                    });

                        
                    addButton.appendChild(dropdownMenu);

                    
                    // Show the dropdown menu when the add button is clicked
                    addButton.addEventListener("click", (e) => {
                        e.stopPropagation();
                        dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
                    });

                    // Hide the dropdown menu when the user clicks outside of it
                    document.body.addEventListener("click", () => {
                        dropdownMenu.style.display = "none";
                    });

                    const hideButton = document.createElement("span");
                    hideButton.innerHTML = "&times;";
                    hideButton.style.border = "1px solid #000000";
                    hideButton.style.fontSize = "25px";
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
                    surface.textContent = annonce.ProOuNon === "Pro" && annonce.Surface > 0 ? `${annonce.Surface} m² FAI` : 
                    annonce.Surface > 0 ? `${annonce.Surface} m²` : "Non renseigné"
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
                    description.textContent = annonce.Description0;
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
                    const dateAddContainer = document.createElement("div");
                    dateAddContainer.textContent = `DateAjoutReperimmo : ${annonce.DateAjoutReperimmo}`;  // Assurez-vous que l'ID de l'annonce est correct
                    dateAddContainer.style.position = "absolute";
                    dateAddContainer.style.bottom = "60px";
                    dateAddContainer.style.left = "10px";
                    dateAddContainer.style.fontSize = "12px";
                    dateAddContainer.style.color = "#000000";  // Vous pouvez ajuster la couleur selon votre thème
                    dateAddContainer.style.backgroundColor = "#FFFFFF";
                    dateAddContainer.style.padding = "5px";
                    dateAddContainer.style.borderRadius = "5px";

                    annonceDiv.appendChild(dateAddContainer);

                    contentDiv.appendChild(annonceDiv);
                }
            });
            
            const nombreAnnonces = document.createElement("p");
            nombreAnnonces.style.width = "100%";
            nombreAnnonces.innerText = `Nombre d'annonces : ${nbAnnonces}`;
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