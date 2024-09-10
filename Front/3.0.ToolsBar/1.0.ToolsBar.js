// Fonction pour créer et gérer les onglets (seulement pour les "Annonces Listées")
function createTabs(container) {
    const tabContainer = document.createElement("div");
    tabContainer.style.display = "flex";
    tabContainer.style.flexGrow = "1";
    tabContainer.style.position = "absolute";
    tabContainer.style.top = "10px";
    tabContainer.style.left = "20px";
    tabContainer.style.right = "20px";

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
        tab.style.padding = "5px 10px";
        tab.style.border = "1px solid #ccc";
        tab.style.borderRadius = "4px";
        tab.style.marginRight = "5px";
        tab.style.backgroundColor = "#000000";
        tab.contentEditable = false;

        const tabContent = document.createElement("span");
        tabContent.style.flexGrow = "1";
        tabContent.innerText = text;
        tab.appendChild(tabContent);

        tab.addEventListener("dblclick", () => {
            tabContent.contentEditable = true;
            tabContent.focus();
        });

        tabContent.addEventListener("blur", () => {
            tabContent.contentEditable = false;
            saveTabsToLocalStorage();
        });

        const closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.marginLeft = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "#FFFFFF";

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
    addTabButton.style.marginLeft = "5px";
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
    closeModalButton.style.top = "10px";
    closeModalButton.style.right = "10px";
    closeModalButton.style.width = "30px";
    closeModalButton.style.height = "30px";
    closeModalButton.style.fontSize = "30px";
    closeModalButton.style.position = "absolute";
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

// Fonction pour afficher les annonces masquées
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

// Fonction pour afficher les annonces listées
// Fonction pour afficher les annonces listées
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
                annonceDiv.style.height = "600px";
                annonceDiv.style.overflow = "hidden";
                annonceDiv.style.transition = "transform 0.2s ease-in-out";
                annonceDiv.style.cursor = "pointer";
                annonceDiv.style.position = "relative";

                const img = document.createElement("img");
                img.src = annonce.image; // Corrigez le nom du champ
                img.alt = annonce.title; // Corrigez le nom du champ
                img.style.width = "100%";
                img.style.height = "300px";
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
