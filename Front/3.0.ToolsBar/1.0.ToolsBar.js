// Fonction pour créer et gérer les sous-onglets
function createSubTabs(tabContainer) {
    const subTabContainer = document.createElement("div");
    subTabContainer.style.display = "flex";
    subTabContainer.style.position = "absolute";  // Rend le conteneur flottant
    subTabContainer.style.marginTop = "0";        // Supprime la marge supérieure
    subTabContainer.style.top = "100%";           // Positionne le conteneur juste sous l'onglet principal
    subTabContainer.style.left = "0";             // Aligne le conteneur à gauche
    subTabContainer.style.border = "1px solid #FFFFFF";
    subTabContainer.style.overflowX = "scroll";
    subTabContainer.style.backgroundColor = "#666666"; // Contexte pour le rendre visible

    const subTabsWrapper = document.createElement("div");
    subTabsWrapper.style.height = "100%"
    subTabsWrapper.style.display = "flex";

    const createSubTab = (text = "Sous-onglet") => {
        const subTab = document.createElement("div");
        subTab.style.padding = "5px 10px";
        subTab.style.border = "1px solid #ccc";
        subTab.style.backgroundColor = "#666666";
        subTab.style.marginRight = "5px";
        subTab.style.cursor = "pointer";
        
        const subTabContent = document.createElement("span");
        subTabContent.innerText = text;
        subTab.appendChild(subTabContent);

        subTabsWrapper.appendChild(subTab);
    };

    const addSubTabButton = document.createElement("button");
    addSubTabButton.innerText = "+ Sous-onglet";
    addSubTabButton.style.padding = "5px 10px";
    addSubTabButton.style.border = "none";
    addSubTabButton.style.backgroundColor = "#f0f0f0";
    addSubTabButton.style.cursor = "pointer";

    addSubTabButton.addEventListener("click", () => {
        createSubTab("Nouveau sous-onglet");
    });

    subTabContainer.appendChild(subTabsWrapper);
    subTabContainer.appendChild(addSubTabButton);


    return subTabContainer;
}

// Modification de la fonction pour créer des onglets avec sous-onglets
function createTabs(container) {
    const tabContainer = document.createElement("div");
    tabContainer.style.display = "flex";
    tabContainer.style.flexGrow = "1";
    tabContainer.style.position = "fixed";
    tabContainer.style.border = "1px solid #FFFFFF";
    tabContainer.style.height = "100%";
    tabContainer.style.overflowX = "scroll";
    tabContainer.style.top = "0px";
    tabContainer.style.left = "0px";
    tabContainer.style.right = "0px";

    const tabsWrapper = document.createElement("div");
    tabsWrapper.style.display = "flex";

    const saveTabsToLocalStorage = () => {
        const tabTexts = Array.from(tabsWrapper.children).map(tab => tab.querySelector('span').innerText);
        localStorage.setItem('tabs', JSON.stringify(tabTexts));
    };

    const loadTabsFromLocalStorage = () => {
        const savedTabs = JSON.parse(localStorage.getItem('tabs'));
        if (savedTabs && savedTabs.length > 0) {
            savedTabs.forEach(tabText => createTab(tabText));
        } else {
            createTab("Annonces listées");
        }
    };

    const createTab = (text = "Annonces listées") => {
        const tab = document.createElement("div");
        tab.style.display = "flex";
        tab.style.alignItems = "center";
        tab.style.height = "50px";
        tab.style.marginLeft = "5px";
        tab.style.border = "1px solid #ccc";
        tab.style.borderRadius = "4px";
        tab.style.backgroundColor = "#000000";
        tab.style.marginRight = "5px";
        tab.style.cursor = "pointer";
    
        const tabContent = document.createElement("span");
        tabContent.style.flexGrow = "1";
        tabContent.innerText = text;
        tab.appendChild(tabContent);
    
        // Double-clic pour éditer le texte de l'onglet
        tabContent.addEventListener("dblclick", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = tabContent.innerText;
            input.style.flexGrow = "1";
            input.style.padding = "5px";
            input.style.border = "none";
            input.style.outline = "none";
    
            tab.replaceChild(input, tabContent);
    
            input.addEventListener("blur", () => {
                tabContent.innerText = input.value || "Onglet sans nom";
                tab.replaceChild(tabContent, input);
                saveTabsToLocalStorage(); // Sauvegarde le nouveau nom de l'onglet
            });
    
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
    
            input.focus();
        });
    
        tab.addEventListener("click", () => {
            const subTabContainer = tab.querySelector(".sub-tabs");
            if (!subTabContainer) {
                createSubTabs(tab); // Crée les sous-onglets à la volée quand on clique sur l'onglet
            }
        });
    
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "#FFFFFF";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.style.width = "30px";  // Largeur du bouton
        closeButton.style.height = "30px"; // Hauteur du bouton
        closeButton.style.fontSize = "30px"; // Hauteur du bouton
        closeButton.style.borderRadius = "50%"; // Optionnel : pour rendre le bouton rond
    
    
        closeButton.addEventListener("click", () => {
            tabsWrapper.removeChild(tab);
            saveTabsToLocalStorage();
        });
    
        tab.appendChild(closeButton);
        tabsWrapper.appendChild(tab);
    };
    

    const addTabButton = document.createElement("button");
    addTabButton.innerText = "+";
    addTabButton.style.padding = "5px 10px";
    addTabButton.style.height = "50px";
    addTabButton.style.marginRight = "50px";
    addTabButton.style.border = "none";
    addTabButton.style.backgroundColor = "#f0f0f0";
    addTabButton.style.cursor = "pointer";

    addTabButton.addEventListener("click", () => {
        createTab("Nouvel onglet");
        saveTabsToLocalStorage();
    });

    loadTabsFromLocalStorage();

    tabContainer.appendChild(tabsWrapper);
    tabContainer.appendChild(addTabButton);
    container.appendChild(tabContainer);
}


// Fonction GetData pour AnnoncesMasquees et AnnoncesListees
async function GetData(route, container, includeTabs = false) {
    container.innerHTML = '';

    const closeModalButton = document.createElement("span");
    closeModalButton.style.color = "#FFFFFF";
    closeModalButton.style.backgroundColor = "#000000";
    closeModalButton.style.top = "0px";
    closeModalButton.style.right = "0px";
    closeModalButton.style.width = "50px";
    closeModalButton.style.height = "50px";
    closeModalButton.style.border = "1px solid #FFFFFF";
    closeModalButton.style.fontSize = "30px";
    closeModalButton.style.position = "absolute";
    closeModalButton.style.textAlign = "center";
    closeModalButton.innerHTML = "&times;";
    closeModalButton.style.cursor = "pointer";
    closeModalButton.addEventListener("click", () => {
        container.style.display = "none";
    });

    if (includeTabs) {
        createTabs(container);
    }

    container.appendChild(closeModalButton);

    try {
        const response = await fetch(route, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
}


function AnnoncesMasquees() {
    const contentDiv = document.querySelector(".ToolsBar");
    const modalMasquees = document.createElement("div");

    modalMasquees.style.width = "1000px";
    modalMasquees.style.height = "600px";
    modalMasquees.style.border = "1px solid #FFFFFF";
    modalMasquees.style.borderRadius = "10px";
    modalMasquees.style.backgroundColor = "#000000";
    modalMasquees.style.zIndex = "10";
    modalMasquees.style.position = "absolute";
    modalMasquees.style.top = "50%";
    modalMasquees.style.left = "50%";
    modalMasquees.style.transform = "translate(-50%, -50%)";
    modalMasquees.style.display = "none";
    modalMasquees.style.flexWrap = "wrap";
    modalMasquees.style.justifyContent = "center";
    modalMasquees.style.alignItems = "center";
    modalMasquees.style.paddingTop = "50px";
    modalMasquees.style.gap = "50px";
    modalMasquees.style.color = "#FFFFFF";
    modalMasquees.style.overflowY = "scroll";

    contentDiv.appendChild(modalMasquees);

    const boutonAnnoncesMasquees = document.querySelector(".AnnoncesMasquee");
    boutonAnnoncesMasquees.addEventListener("click", async () => {
        modalMasquees.innerHTML = "";

        const data = await GetData("http://localhost:5000/api/annonces/hidden", modalMasquees);
        if (data && data.length > 0) {
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

                const img = document.createElement("img");
                img.src = annonce.Image;
                img.alt = annonce.Titre;
                img.style.width = "100%";
                img.style.height = "300px";
                img.style.objectFit = "cover";
                annonceDiv.appendChild(img);

                const restoreButton = document.createElement("button");
                restoreButton.innerText = "Restaurer";
                restoreButton.classList.add("restore-btn");
                restoreButton.style.position = "absolute";
                restoreButton.style.bottom = "10px";
                restoreButton.style.right = "10px";
                restoreButton.style.padding = "10px 20px";
                restoreButton.style.backgroundColor = "#00FF00";
                restoreButton.style.color = "#ffffff";
                restoreButton.style.border = "none";
                restoreButton.style.borderRadius = "4px";
                restoreButton.style.cursor = "pointer";

                restoreButton.addEventListener("click", () => {
                    fetch("http://localhost:5000/api/annonces/show", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: annonce._id })
                    }).then(() => {
                        annonceDiv.remove();
                    });
                });

                annonceDiv.appendChild(restoreButton);
                modalMasquees.appendChild(annonceDiv);
            });
        } 

        modalMasquees.style.display = "flex";
    });
}

function AnnoncesListees() {
    const contentDiv = document.querySelector(".ToolsBar");
    const modalList = document.createElement("div");

    // Styles de la modale (inchangés)
    modalList.style.width = "1000px";
    modalList.style.height = "600px";
    modalList.style.border = "1px solid #FFFFFF";
    modalList.style.borderRadius = "10px";
    modalList.style.backgroundColor = "#000000";
    modalList.style.zIndex = "10";
    modalList.style.position = "absolute";
    modalList.style.top = "50%";
    modalList.style.left = "50%";
    modalList.style.transform = "translate(-50%, -50%)";
    modalList.style.display = "none";
    modalList.style.flexWrap = "wrap";
    modalList.style.justifyContent = "center";
    modalList.style.alignItems = "center";
    modalList.style.paddingTop = "50px";
    modalList.style.gap = "50px";
    modalList.style.color = "#FFFFFF";
    modalList.style.overflowY = "scroll";

    contentDiv.appendChild(modalList);

    let annoncesRetirees = JSON.parse(localStorage.getItem("annoncesRetirees")) || [];

    const boutonAnnoncesList = document.querySelector(".AnnoncesListe");
    boutonAnnoncesList.addEventListener("click", async () => {
        modalList.innerHTML = "";

        const data = await GetData("http://localhost:5000/api/annonces/listed", modalList, true);
        if (data) {
            const annoncesFiltrees = data.filter(annonce => !annoncesRetirees.includes(annonce._id));

            annoncesFiltrees.forEach(annonce => {
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
                img.src = annonce.image; // Corrigez le nom du champ
                img.alt = annonce.title; // Corrigez le nom du champ
                img.style.width = "100%";
                img.style.height = "200px";
                img.style.objectFit = "cover";
                annonceDiv.appendChild(img);
                
                const removeButton = document.createElement("button");
                removeButton.innerText = "Retirer";
                removeButton.classList.add("remove-btn");
                removeButton.style.position = "absolute";
                removeButton.style.bottom = "10px";
                removeButton.style.right = "10px";
                removeButton.style.padding = "10px 20px";
                removeButton.style.backgroundColor = "#ff0000";
                removeButton.style.color = "#ffffff";
                removeButton.style.border = "none";
                removeButton.style.borderRadius = "4px";
                removeButton.style.cursor = "pointer";

                removeButton.addEventListener("click", async () => {
                    annoncesRetirees.push(annonce._id);
                    localStorage.setItem("annoncesRetirees", JSON.stringify(annoncesRetirees));

                    // Faire la requête DELETE pour retirer l'annonce du serveur
                    await fetch("http://localhost:5000/api/annonces/listed", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: annonce._id })
                    });

                    annonceDiv.remove();
                });

                annonceDiv.appendChild(removeButton);
                modalList.appendChild(annonceDiv);
            });
        }
        modalList.style.display = "flex";
        
    });
}



function gestionAnnonces() {
    AnnoncesMasquees();
    AnnoncesListees();
}
