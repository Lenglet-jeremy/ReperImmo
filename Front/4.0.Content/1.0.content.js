// content.js

function loadAnnonces(showHidden = false) {
    fetch('http://localhost:5000/api/annonces')
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.querySelector('.Content');
            contentDiv.innerHTML = ''; // Clear previous content if any

            contentDiv.style.display = "flex";
            contentDiv.style.flexWrap = "wrap";
            contentDiv.style.justifyContent = "center";
            contentDiv.style.alignItems = "flex-start";
            contentDiv.style.overflowY = "scroll";
            contentDiv.style.height = "calc(100vh - 99px)";
            contentDiv.style.gap = "20px";
            contentDiv.style.padding = "20px";

            data.forEach(annonce => {
                if (annonce.toDisplay || showHidden) {
                const annonceDiv = document.createElement('div');
                annonceDiv.classList.add('annonce');
                annonceDiv.style.backgroundColor = "#444444";
                annonceDiv.style.display = "flex";
                annonceDiv.style.flexDirection = "column";
                annonceDiv.style.border = "1px solid #ddd";
                annonceDiv.style.borderRadius = "8px";
                annonceDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                annonceDiv.style.width = "320px";
                annonceDiv.style.height = "400px";
                annonceDiv.style.overflow = "hidden";
                annonceDiv.style.transition = "transform 0.2s ease-in-out";
                annonceDiv.style.cursor = "pointer";
                annonceDiv.style.position = "relative"; // Nécessaire pour positionner la croix en absolu

                annonceDiv.addEventListener('mouseover', () => {
                    annonceDiv.style.transform = "scale(1.02)";
                });
                annonceDiv.addEventListener('mouseout', () => {
                    annonceDiv.style.transform = "scale(1)";
                });

                // Image de l'annonce
                const img = document.createElement('img');
                img.src = annonce.Image;
                img.alt = "Image de l'annonce";
                img.style.width = "100%";
                img.style.height = "180px";
                img.style.objectFit = "cover";
                annonceDiv.appendChild(img);

                // Conteneur pour le texte
                const textContainer = document.createElement('div');
                textContainer.style.padding = "15px";

                // Conteneur pour le prix et la croix
                const priceAndHideContainer = document.createElement('div');
                priceAndHideContainer.style.display = "flex";
                priceAndHideContainer.style.justifyContent = "space-between";
                priceAndHideContainer.style.alignItems = "center";

                // Prix
                const prix = document.createElement('h2');
                prix.textContent = annonce.Prix;
                prix.style.margin = "0";
                prix.style.fontSize = "22px";
                prix.style.fontWeight = "bold";
                priceAndHideContainer.appendChild(prix);

                // Bouton pour masquer l'annonce (croix)
                const hideButton = document.createElement('span');
                hideButton.innerHTML = "&times;"; // HTML entity pour le symbole de la croix
                hideButton.style.color = "#ff0000";
                hideButton.style.fontSize = "24px";
                hideButton.style.cursor = "pointer";
                hideButton.addEventListener('click', () => {
                    fetch(`http://localhost:5000/api/annonces/${annonce._id}/hide`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            annonceDiv.style.display = 'none';
                        } else {
                            console.error('Erreur lors du masquage de l\'annonce');
                        }
                    })
                    .catch(error => console.error('Erreur lors de la requête pour masquer l\'annonce:', error));
                });
                priceAndHideContainer.appendChild(hideButton);

                textContainer.appendChild(priceAndHideContainer);

                // Ajout de la date d'ajout de l'annonce
                const dateAjout = document.createElement('p');
                dateAjout.textContent = `Ajoutée le : ${annonce.DateAjout}`;
                dateAjout.style.margin = "5px 0";
                dateAjout.style.fontSize = "12px";
                dateAjout.style.color = "#bbb";
                textContainer.appendChild(dateAjout);

                // Localisation
                const localisation = document.createElement('p');
                localisation.textContent = annonce.Localisation;
                localisation.style.margin = "5px 0";
                localisation.style.fontSize = "14px";
                textContainer.appendChild(localisation);

                // Description
                const description = document.createElement('p');
                description.textContent = annonce.Description;
                description.style.margin = "5px 0";
                description.style.fontSize = "16px";
                description.style.fontWeight = "normal";
                textContainer.appendChild(description);

                // Prix au m²
                const prixaumcarre = document.createElement('div');
                prixaumcarre.textContent = annonce.PrixAuMCarre;
                prixaumcarre.style.marginTop = "10px";
                prixaumcarre.style.padding = "8px";
                prixaumcarre.style.backgroundColor = "#f6f6f6";
                prixaumcarre.style.color = "#333";
                prixaumcarre.style.fontSize = "14px";
                prixaumcarre.style.borderRadius = "5px";
                prixaumcarre.style.textAlign = "center";
                textContainer.appendChild(prixaumcarre);
                if (annonce.PrixAuMCarre === "") {
                    prixaumcarre.style.display = "none"
                }

                annonceDiv.appendChild(textContainer);
                
                // Lien vers l'annonce
                const link = document.createElement('a');
                link.href = annonce.LienAnnonce;
                link.textContent = "Voir l'annonce";
                link.target = "_blank";
                link.style.textDecoration = "none";
                link.style.color = "#007bff";
                link.style.display = "block";
                link.style.textAlign = "center";
                link.style.padding = "10px";
                link.style.marginTop = "auto";
                link.style.backgroundColor = "#e9ecef";
                link.style.borderTop = "1px solid #ddd";
                link.style.borderBottomLeftRadius = "8px";
                link.style.borderBottomRightRadius = "8px";
                annonceDiv.appendChild(link);

                // Ajout du conteneur annonce au contentDiv
                if (annonce.toDisplay || showHidden) {
                    contentDiv.appendChild(annonceDiv);
                }
            }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des annonces:', error));
}

// Appeler la fonction loadAnnonces pour charger les annonces visibles lors du chargement de la page
loadAnnonces();
