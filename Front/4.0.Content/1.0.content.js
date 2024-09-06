function loadAnnonces() {
    fetch("http://localhost:5000/api/annonces")
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

            data.forEach(annonce => {
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

                    // Conteneur pour le texte
                    const textContainer = document.createElement("div");
                    textContainer.style.padding = "15px";

                    const priceAndHideContainer = document.createElement("div");
                    priceAndHideContainer.style.display = "flex";
                    priceAndHideContainer.style.justifyContent = "space-between";
                    priceAndHideContainer.style.alignItems = "center";

                    const prix = document.createElement("h2");
                    prix.textContent = annonce.Prix;
                    prix.style.margin = "0";
                    prix.style.fontSize = "22px";
                    prix.style.fontWeight = "bold";
                    priceAndHideContainer.appendChild(prix);

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

                    // Ajout du gestionnaire de clic pour cacher l'annonce
                    hideButton.addEventListener("click", () => {
                        // Mettre à jour toDisplay à false
                        fetch(`http://localhost:5000/api/annonces/hide`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: annonce._id, // Assurez-vous que 'annonce._id' est bien la propriété contenant l'ID unique
                                toDisplay: false
                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                // Supprimer l'annonce du DOM
                                contentDiv.removeChild(annonceDiv);
                            } else {
                                console.error("Erreur lors de la mise à jour de l'annonce.");
                            }
                        })
                        .catch(error => console.error("Erreur lors de la requête:", error));
                    });

                    buttonContainer.appendChild(addButton);
                    buttonContainer.appendChild(hideButton);

                    priceAndHideContainer.appendChild(buttonContainer);
                    textContainer.appendChild(priceAndHideContainer);

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
                    link.target = "_blanck"
                    link.textContent = "Voir l'annonce";
                    link.style.textAlign = "center";
                    link.style.marginTop = "auto";
                    link.style.padding = "15px 0";
                    link.style.fontWeight = "bold";
                    link.style.backgroundColor = "#f1f1f1";
                    link.style.borderTop = "1px solid #ddd";
                    annonceDiv.appendChild(link);

                    contentDiv.appendChild(annonceDiv);

                    annonceDiv.addEventListener("mouseover", () => {
                        annonceDiv.style.transform = "scale(1.05)";
                        annonceDiv.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.15)";
                    });

                    annonceDiv.addEventListener("mouseout", () => {
                        annonceDiv.style.transform = "scale(1)";
                        annonceDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                    });

                }
            });
        })
        .catch(error => console.error("Erreur lors du chargement des annonces:", error));
}
