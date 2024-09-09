let currentPage = 1; // Définir currentPage à l'extérieur de la fonction



function loadAnnonces() {
    

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
                if (annonce.toDisplay) {
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
                    img.alt = annonce.Titre;
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
                                id: annonce._id
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) {
                                console.log("Annonce ajoutée à la liste avec succès.");
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
                        // Supprimer immédiatement l'annonce du DOM
                        annonceDiv.remove();
                    
                        // Ensuite, effectuer la requête pour cacher l'annonce côté serveur
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
                    surface.textContent = `Surface: ${annonce.surface} m²`;
                    surface.style.fontSize = "16px";
                    surface.style.color = "#555";
                    detailsContainer.appendChild(surface);

                    const pieces = document.createElement("p");
                    pieces.textContent = `Nombre de pièces: ${annonce.nombreDePieces}`;
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
                        window.location.href = `/annonce/${annonce._id}`;
                    });

                    annonceDiv.appendChild(viewButton);
                    contentDiv.appendChild(annonceDiv);
                }
            });

            // Conteneur de pagination
            const paginationDiv = document.createElement("div");
            paginationDiv.style.display = "flex";
            paginationDiv.style.justifyContent = "center";
            paginationDiv.style.position = "absolute";
            paginationDiv.style.bottom = "20px";
            paginationDiv.style.left = "0";
            paginationDiv.style.right = "0";
            paginationDiv.style.gap = "10px";

            const buttonWrapper = document.createElement("div");
            buttonWrapper.style.display = "flex";
            buttonWrapper.style.justifyContent = "space-between";
            buttonWrapper.style.width = "200px"; // Largeur fixe pour éviter le décalage

            // const prevButton = document.createElement("button");
            // prevButton.textContent = "Précédent";
            // prevButton.disabled = data.currentPage === 1; // Désactiver le bouton "Précédent" si on est sur la première page
            // prevButton.addEventListener("click", () => {
            //     currentPage--;
            //     loadAnnonces(currentPage);
            // });
            // buttonWrapper.appendChild(prevButton);

            // const nextButton = document.createElement("button");
            // nextButton.textContent = "Suivant";
            // nextButton.disabled = data.currentPage === data.totalPages; // Désactiver si on est sur la dernière page
            // nextButton.addEventListener("click", () => {
            //     currentPage++;
            //     loadAnnonces(currentPage);
            // });
            // buttonWrapper.appendChild(nextButton);

            paginationDiv.appendChild(buttonWrapper);
            contentDiv.appendChild(paginationDiv);
        })
        .catch(error => console.error("Erreur lors du chargement des annonces:", error));
}

