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

function createTabsAndCloseButton(container, contentContainer) {
    // Création du conteneur des onglets
    const tabContainer = document.createElement("div");
    tabContainer.classList.add("TabContainer")
    tabContainer.style.display = "flex";
    tabContainer.style.alignItems = "center";
    tabContainer.style.justifyContent = "space-between";
    tabContainer.style.height = "50px";
    tabContainer.style.borderBottom = "1px solid #FFFFFF";
    tabContainer.style.padding = "0px 10px";
    tabContainer.style.overflowX = "scroll";
    tabContainer.style.backgroundColor = "#222"; // Arrière-plan sombre pour les onglets

    const tabsWrapper = document.createElement("div");
    tabsWrapper.style.display = "flex";
    tabsWrapper.style.flexGrow = "1";

    const addTabButton = document.createElement("button");
    addTabButton.innerText = "+ Ajouter onglet";
    addTabButton.style.padding = "5px 10px";
    addTabButton.style.marginLeft = "auto";
    addTabButton.style.border = "none";
    addTabButton.style.backgroundColor = "#f0f0f0";
    addTabButton.style.cursor = "pointer";
    addTabButton.addEventListener("click", () => {
        createTab(tabsWrapper, contentContainer, "Nouvel onglet");
    });

    // Bouton de fermeture
    const closeButton = document.createElement("span");
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#FFFFFF";
    closeButton.innerHTML = "&times;";
    closeButton.style.fontSize = "24px";
    closeButton.style.marginLeft = "10px";
    closeButton.addEventListener("click", () => {
        container.style.display = "none"; // Fermer la modale
    });

    tabContainer.appendChild(tabsWrapper);
    tabContainer.appendChild(addTabButton);
    tabContainer.appendChild(closeButton);
    container.appendChild(tabContainer);

    // Charger les onglets sauvegardés
    loadTabsFromLocalStorage(tabsWrapper, contentContainer);
}

function createTab(tabsWrapper, contentContainer, tabName) {
    const tab = document.createElement("div");
    tab.style.padding = "10px";
    tab.style.marginRight = "10px";
    tab.style.backgroundColor = "#000000";
    tab.style.color = "#FFFFFF";
    tab.style.cursor = "pointer";
    tab.style.border = "1px solid #ccc";
    tab.style.borderRadius = "4px";
    
    const tabContent = document.createElement("span");
    tabContent.innerText = tabName;
    tab.appendChild(tabContent);

    // Double-clic pour renommer l'onglet (ceci affecte uniquement l'onglet, pas le contenu associé)
    tabContent.addEventListener("dblclick", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = tabContent.innerText;
        input.style.width = "100px"; // Largeur du champ de texte
        tab.replaceChild(input, tabContent);

        // Sauvegarde du nouveau nom de l'onglet après édition
        const saveTabName = () => {
            tabContent.innerText = input.value;
            tab.replaceChild(tabContent, input);
            saveTabsToLocalStorage(); // Sauvegarde dans localStorage
        };

        input.addEventListener("blur", saveTabName);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveTabName();
            }
        });

        input.focus();
    });

    // Gestion de la fermeture de l'onglet
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.cursor = "pointer";
    closeButton.style.marginLeft = "10px";
    closeButton.addEventListener("click", () => {
        tabsWrapper.removeChild(tab);
        saveTabsToLocalStorage(tabsWrapper);  // Sauvegarder après la suppression
    });

    tab.appendChild(closeButton);
    tabsWrapper.appendChild(tab);

    // Gestion de l'affichage du contenu lié à l'onglet (le nom ici ne change pas lorsque l'onglet est renommé)
    tab.addEventListener("click", () => {
        contentContainer.innerHTML = ''; 
        const contentDiv = document.createElement("div");
        contentDiv.style.padding = "20px";
        contentDiv.style.color = "#ffffff";
        contentDiv.style.backgroundColor = "#333";
        contentDiv.innerText = `Contenu de l'onglet ${tabName}`; // On utilise le nom initial ici
        contentContainer.appendChild(contentDiv);
    });

    saveTabsToLocalStorage(tabsWrapper);  // Sauvegarder les onglets dans le localStorage
}



function saveTabsToLocalStorage(tabsWrapper) {
    const tabNames = Array.from(tabsWrapper.children).map(tab => tab.querySelector('span').innerText.trim());
    localStorage.setItem('tabs', JSON.stringify(tabNames));
}

function loadTabsFromLocalStorage(tabsWrapper, contentContainer) {
    const savedTabs = JSON.parse(localStorage.getItem('tabs'));
    if (savedTabs && savedTabs.length > 0) {
        savedTabs.forEach(tabName => createTab(tabsWrapper, contentContainer, tabName));
    } else {
        // Si aucun onglet n'est sauvegardé, créer un onglet par défaut
        createTab(tabsWrapper, contentContainer, "Onglet par défaut");
    }
}

function createTabs(container) {
    const tabContainer = document.createElement("div");
    tabContainer.classList.add("TabContainer")
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

    const contentContainer = document.createElement("div"); // Sous-conteneur pour le contenu des onglets
    contentContainer.classList.add("ContentContainer")
    contentContainer.style.flexGrow = "1";
    contentContainer.style.width = "100%";
    contentContainer.style.height = "100%";
    contentContainer.style.color = "#ffffff";
    contentContainer.style.backgroundColor = "#333";

    const saveTabsToLocalStorage = () => {
        const tabTexts = Array.from(tabsWrapper.children).map(tab => tab.querySelector('span').innerText);
        localStorage.setItem('tabs', JSON.stringify(tabTexts));
    };

    const createTab = (text = "Annonces listées") => {
        const tab = document.createElement("div");
        tab.style.display = "flex";
        tab.style.alignItems = "center";
        tab.style.height = "50px";
        tab.style.border = "1px solid #ccc";
        tab.style.borderRadius = "4px";
        tab.style.backgroundColor = "#000000";
        tab.style.cursor = "pointer";
    
        const tabContent = document.createElement("span");
        tabContent.style.flexGrow = "1";
        tabContent.innerText = text;
        tab.appendChild(tabContent);
    
        // Ajout du double-clic pour éditer le nom de l'onglet
        tabContent.addEventListener("dblclick", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = tabContent.innerText;
            input.style.flexGrow = "1";
    
            // Lorsque l'utilisateur termine l'édition (perte de focus ou touche Entrée)
            input.addEventListener("blur", () => {
                tabContent.innerText = input.value;
                tab.replaceChild(tabContent, input);  // Remplacer le champ de texte par le texte mis à jour
                saveTabsToLocalStorage();  // Sauvegarder les nouveaux noms des onglets
            });
    
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    input.blur();  // Simuler la perte de focus lorsque l'utilisateur appuie sur Entrée
                }
            });
    
            tab.replaceChild(input, tabContent);  // Remplacer le texte par un champ de texte
            input.focus();  // Mettre le focus sur le champ pour que l'utilisateur puisse immédiatement commencer à taper
        });
    
        tab.addEventListener("click", () => {
            // Vider uniquement le sous-conteneur de contenu (et non l'ensemble du container)
            contentContainer.innerHTML = ''; 
    
            const contentDiv = document.createElement("div");
            contentDiv.style.color = "#ffffff";
            contentDiv.style.display = "flex";
            contentDiv.style.flexGrow = "1";
            contentDiv.style.width = "100%";
            contentDiv.style.height = "100%";
            contentDiv.style.backgroundColor = "#333";
            contentDiv.innerText = `Contenu de l'onglet ${tabContent.innerText}`;
    
            contentContainer.appendChild(contentDiv);
        });
    
        const closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "#FFFFFF";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.style.width = "30px";
        closeButton.style.height = "30px";
        closeButton.style.fontSize = "30px";
        closeButton.style.borderRadius = "50%";
    
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
    container.appendChild(contentContainer);  // Ajout du sous-conteneur pour le contenu
}

// Fonction GetData mise à jour pour inclure les onglets
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

    // Créer la modale globale
    const modalList = document.createElement("div");
    modalList.classList.add("modal-global");
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
    modalList.style.flexDirection = "column";  // Organiser le contenu verticalement

    // Créer le conteneur pour le contenu des onglets
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("ContentContainer")
    contentContainer.style.overflowY = "scroll";
    contentContainer.style.color = "#FFFFFF";
    contentContainer.style.backgroundColor = "#000000";  // Arrière-plan noir pour le contenu

    // Ajouter les onglets et le bouton de fermeture dans la modale
    createTabsAndCloseButton(modalList, contentContainer);

    // Ajouter la div du contenu dans la modale
    modalList.appendChild(contentContainer);

    // Ajouter la modale dans le conteneur principal
    contentDiv.appendChild(modalList);

    // Gérer l'affichage de la modale lorsque le bouton est cliqué
    const boutonAnnoncesList = document.querySelector(".AnnoncesListe");
    boutonAnnoncesList.addEventListener("click", () => {
        modalList.style.display = "flex";
    });
}



function gestionAnnonces() {
    AnnoncesMasquees();
    AnnoncesListees();
}
