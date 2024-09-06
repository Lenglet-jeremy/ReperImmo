async function GetData(route, container) {
    // Vider le contenu précédent du conteneur
    container.innerHTML = ''; 

    const closeModalButton = document.createElement("span");
    closeModalButton.style.color = "#FFFFFF";
    closeModalButton.style.top = "10px";
    closeModalButton.style.right = "20px";
    closeModalButton.style.width = "20px";
    closeModalButton.style.height = "20px";
    closeModalButton.style.fontSize = "30px";
    closeModalButton.style.position = "absolute";
    closeModalButton.innerHTML = "&times;";
    closeModalButton.style.cursor = "pointer";
    
    closeModalButton.addEventListener("click", () => {
        container.style.display = "none";
    });

    container.appendChild(closeModalButton);

    try {
        const response = await fetch(route, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
}

function AnnoncesMasquees() {
    const contentDiv = document.querySelector(".ToolsBar");
    const modalMasquees = document.createElement("div");

    // Style de la modale pour les annonces masquées
    modalMasquees.style.width = "1000px"; 
    modalMasquees.style.height = "600px"; 
    modalMasquees.style.border = "1px solid #FFFFFF";
    modalMasquees.style.borderRadius = "10px";
    modalMasquees.style.backgroundColor = "#000000";
    modalMasquees.style.zIndex = "10";
    modalMasquees.style.position = "absolute";
    modalMasquees.style.top = "50%";
    modalMasquees.style.left = "50%";
    modalMasquees.style.transform = "translate(-50%, -50%)"; // Centrer la modale
    modalMasquees.style.display = "none";
    modalMasquees.style.flexWrap = "wrap";
    modalMasquees.style.justifyContent = "center";
    modalMasquees.style.alignItems = "center";
    modalMasquees.style.paddingTop = "50px";
    modalMasquees.style.gap = "50px";
    modalMasquees.style.color = "#FFFFFF";
    modalMasquees.style.overflowY = "scroll"; 

    contentDiv.appendChild(modalMasquees);

    // Écouteur d'événement pour le bouton des annonces masquées
    const boutonAnnoncesMasquee = document.querySelector(".AnnoncesMasquee");
    boutonAnnoncesMasquee.addEventListener("click", async () => {
        const data = await GetData("http://localhost:5000/api/annonces/hide", modalMasquees);
        if (data) {
            data.forEach(annonce => {
                const annonceDiv = document.createElement("div");
                annonceDiv.classList.add("annonce");
                annonceDiv.style.backgroundColor = "#000000";
                annonceDiv.style.display = "flex";
                annonceDiv.style.flexDirection = "column";
                annonceDiv.style.border = "1px solid #ddd";
                annonceDiv.style.borderRadius = "8px";
                annonceDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                annonceDiv.style.width = "400px";
                annonceDiv.style.height = "600px";
                annonceDiv.style.overflow = "hidden";
                annonceDiv.style.transition = "transform 0.2s ease-in-out";
                annonceDiv.style.cursor = "pointer";
                annonceDiv.style.position = "relative";

                // Ajout de l'image
                const img = document.createElement("img");
                img.src = annonce.Image;
                img.alt = annonce.Titre;
                img.style.width = "100%";
                img.style.height = "300px";
                img.style.objectFit = "cover";
                annonceDiv.appendChild(img);

                // Bouton "Restaurer"
                const restoreButton = document.createElement("button");
                restoreButton.textContent = "Restaurer";
                restoreButton.style.backgroundColor = "#4CAF50";
                restoreButton.style.color = "#fff";
                restoreButton.style.border = "none";
                restoreButton.style.padding = "10px";
                restoreButton.style.cursor = "pointer";
                restoreButton.style.borderRadius = "5px";
                restoreButton.style.position = "absolute";
                restoreButton.style.top = "10px";
                restoreButton.style.right = "10px";
                restoreButton.style.zIndex = "1";

                restoreButton.addEventListener("click", () => {
                    fetch(`http://localhost:5000/api/annonces/show`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: annonce._id,
                            toDisplay: true
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            modalMasquees.removeChild(annonceDiv);
                        } else {
                            console.error("Erreur lors de la restauration de l'annonce.");
                        }
                    })
                    .catch(error => console.error("Erreur lors de la requête:", error));
                });

                annonceDiv.appendChild(restoreButton); 

                // Conteneur pour le texte
                const textContainer = document.createElement("div");
                textContainer.style.padding = "15px";

                const priceAndRestoreContainer = document.createElement("div");
                priceAndRestoreContainer.style.display = "flex";
                priceAndRestoreContainer.style.justifyContent = "space-between";
                priceAndRestoreContainer.style.alignItems = "center";

                const prix = document.createElement("h2");
                prix.textContent = annonce.Prix;
                prix.style.margin = "0";
                prix.style.fontSize = "22px";
                prix.style.fontWeight = "bold";
                priceAndRestoreContainer.appendChild(prix);

                textContainer.appendChild(priceAndRestoreContainer);

                const title = document.createElement("h3");
                title.textContent = annonce.Titre;
                title.style.margin = "10px 0";
                title.style.fontSize = "18px";
                textContainer.appendChild(title);

                const description = document.createElement("p");
                description.textContent = annonce.Description;
                description.style.margin = "10px 0";
                description.style.fontSize = "14px";
                description.style.color = "#555";
                textContainer.appendChild(description);

                annonceDiv.appendChild(textContainer);

                const link = document.createElement("a");
                link.href = annonce.LienAnnonce;
                link.target = "_blank";
                link.textContent = "Voir l'annonce";
                link.style.textAlign = "center";
                link.style.marginTop = "auto";
                link.style.padding = "15px 0";
                link.style.fontWeight = "bold";
                link.style.backgroundColor = "#f1f1f1";
                link.style.borderTop = "1px solid #ddd";
                annonceDiv.appendChild(link);

                // Hover effect
                annonceDiv.addEventListener("mouseover", () => {
                    annonceDiv.style.transform = "scale(1.05)";
                    annonceDiv.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.15)";
                });

                annonceDiv.addEventListener("mouseout", () => {
                    annonceDiv.style.transform = "scale(1)";
                    annonceDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                });

                modalMasquees.appendChild(annonceDiv);
            });
        }
        modalMasquees.style.display = "flex";
    });
}

function AnnoncesListees() {
    // const contentDiv = document.querySelector(".ToolsBar");
    // const modalListees = document.createElement("div");

    // // Style de la modale pour les annonces listées
    // modalListees.style.width = "1000px"; 
    // modalListees.style.height = "600px"; 
    // modalListees.style.border = "1px solid #FFFFFF";
    // modalListees.style.borderRadius = "10px";
    // modalListees.style.backgroundColor = "#000000";
    // modalListees.style.zIndex = "10";
    // modalListees.style.position = "absolute";
    // modalListees.style.top = "50%";
    // modalListees.style.left = "50%";
    // modalListees.style.transform = "translate(-50%, -50%)";
    // modalListees.style.display = "none"; 
    // modalListees.style.flexWrap = "wrap";
    // modalListees.style.justifyContent = "center";
    // modalListees.style.alignItems = "center";
    // modalListees.style.paddingTop = "50px";
    // modalListees.style.gap = "50px";
    // modalListees.style.color = "#FFFFFF";
    // modalListees.style.overflowY = "scroll"; 

    // contentDiv.appendChild(modalListees);

    // const boutonAnnoncesListees = document.querySelector(".AnnoncesListe");
    // boutonAnnoncesListees.addEventListener("click", async () => {
    //     const data = await GetData("http://localhost:5000/api/annonces/listed", modalListees);
    //     if (data) {
    //         // Traiter les annonces listées de la même manière que les annonces masquées
    //     }
    //     modalListees.style.display = "flex";
    // });
}

function gestionAnnonces() {
    AnnoncesMasquees(); // Gérer les annonces masquées
    AnnoncesListees();   // Gérer les annonces listées
}
