let tabMenus = {}; // Stocke les menus pour chaque onglet
let currentTabName = ""; // Suivi de l'onglet actif

function getTabsAndMenus() {
    let tabsAndMenus = [];

    // Récupérer les onglets et les menus sauvegardés
    const savedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
    const savedMenus = JSON.parse(localStorage.getItem('tabMenus')) || {};

    savedTabs.forEach(tab => {
        const tabName = tab.tabName;
        let menus = savedMenus[tabName] ? JSON.parse(JSON.stringify(savedMenus[tabName])) : [];

        tabsAndMenus.push({
            tabName: tabName,
            menus: menus
        });
    });

    return tabsAndMenus;
}

function updateTabMenu(tabName, updatedMenus) {
    const savedMenus = JSON.parse(localStorage.getItem('tabMenus')) || {};
    savedMenus[tabName] = updatedMenus;
    localStorage.setItem('tabMenus', JSON.stringify(savedMenus));
}

function createTabsAndCloseButton(container, contentContainer) {
    const tabContainer = document.createElement("div");
    tabContainer.classList.add("TabContainer");
    tabContainer.style.display = "flex";
    tabContainer.style.alignItems = "center";
    tabContainer.style.justifyContent = "space-between";
    tabContainer.style.height = "50px";
    tabContainer.style.borderBottom = "1px solid #FFFFFF";
    tabContainer.style.padding = "0px 10px";
    tabContainer.style.overflowX = "scroll";
    tabContainer.style.backgroundColor = "#222"; // Arrière-plan sombre

    const tabsWrapper = document.createElement("div");

    const addTabButton = document.createElement("button");
    addTabButton.innerText = "Ajouter onglet";
    addTabButton.style.padding = "5px 10px";
    addTabButton.style.border = "none";
    addTabButton.style.marginLeft = "auto";
    addTabButton.style.backgroundColor = "#f0f0f0";
    addTabButton.style.cursor = "pointer";
    addTabButton.addEventListener("click", () => {
        const newTabName = "Nouvel onglet";
        createTab(tabsWrapper, contentContainer, newTabName);
    });

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

function createMenuBar() {
    const menuBar = document.createElement("div");
    menuBar.classList.add("MenuBar");
    menuBar.style.width = "200px";
    menuBar.style.height = "100%";
    menuBar.style.display = "flex";
    menuBar.style.flexDirection = "column";
    menuBar.style.justifyContent = "space-between";
    menuBar.style.border = "1px solid #FFFFFF";

    const menuWrapper = document.createElement("div");
    menuWrapper.classList.add("MenuWrapper");
    menuWrapper.style.flexDirection = "column";
    menuWrapper.style.justifyContent = "space-between";

    const addMenu = document.createElement("button");
    addMenu.innerText = "Ajouter menu";
    addMenu.style.border = "1px solid #FFFFFF";
    addMenu.style.margin = "20px";

    addMenu.addEventListener("click", () => {
        const menu = createMenu();
        menuWrapper.appendChild(menu);
        saveMenusToLocalStorage(currentTabName, menuWrapper); // Sauvegarder les menus de l'onglet actif
    });

    menuBar.appendChild(menuWrapper);
    menuBar.appendChild(addMenu);

    // Charger les menus de l'onglet actif
    loadMenusFromLocalStorage(currentTabName, menuWrapper);

    return menuBar;
}

function createMenu(menuName = "Menu", menuWrapper = null) {
    // Si aucun menuWrapper n'est fourni, on prend celui de l'onglet actuel
    if (!menuWrapper) {
        menuWrapper = document.querySelector(".MenuWrapper");
    }

    const container = document.createElement("div");
    container.classList.add("MenuContainer");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.width = "100%";

    const menu = document.createElement("div");
    menu.classList.add("Menu");
    menu.innerText = menuName;
    menu.style.flexGrow = "1";
    menu.style.height = "30px";
    menu.style.cursor = "pointer";
    menu.style.display = "flex";
    menu.style.alignItems = "center";
    menu.style.paddingLeft = "10px";

    function enableEditing() {
        const input = document.createElement("input");
        input.type = "text";
        input.value = menu.innerText;
        input.style.flexGrow = "1";
        input.style.height = "30px";

        input.addEventListener("blur", () => {
            menu.innerText = input.value;
            container.replaceChild(menu, input);
            saveMenusToLocalStorage(currentTabName, menuWrapper);
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });

        container.replaceChild(input, menu);
        input.focus();
    }

    menu.addEventListener("dblclick", enableEditing);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.style.marginRight = "20px";
    deleteButton.style.width = "20px";

    deleteButton.addEventListener("click", () => {
        container.remove();
        saveMenusToLocalStorage(currentTabName, menuWrapper);
    });

    menu.addEventListener("click", () => {
        const contentArea = document.querySelector(".MenuContentArea");
        contentArea.innerHTML = '';
        const menuContent = createContentMenu();
        contentArea.appendChild(menuContent);
    });

    container.appendChild(menu);
    container.appendChild(deleteButton);

    return container;
}


function createContentMenu() {
    const menuContent = document.createElement("div");
    menuContent.classList.add("menuContent");
    menuContent.innerText = "Contenu";
    menuContent.style.width = "100%";
    menuContent.style.height = "100%";
    menuContent.style.display = "flex";
    menuContent.style.justifyContent = "center";
    menuContent.style.alignItems = "center";
    menuContent.style.color = "#FFFFFF";
    menuContent.style.backgroundColor = "#333";

    return menuContent;
}

function createTab(tabsWrapper, contentContainer, tabName) {
    const tab = document.createElement("div");
    tab.style.padding = "10px";
    tab.style.backgroundColor = "#000000";
    tab.style.color = "#FFFFFF";
    tab.style.cursor = "pointer";
    tab.style.border = "1px solid #ccc";
    tab.style.borderRadius = "4px";

    const tabContent = document.createElement("span");
    tabContent.innerText = tabName;
    tab.appendChild(tabContent);

    const menuContentArea = document.createElement("div");
    menuContentArea.classList.add("MenuContentArea");
    menuContentArea.style.flexGrow = "1";
    menuContentArea.style.width = "100%";
    menuContentArea.style.height = "100%";

    // Renommer l'onglet
    tabContent.addEventListener("dblclick", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = tabContent.innerText;
        input.style.width = "100px"; // Largeur du champ de texte
        tab.replaceChild(input, tabContent);

        const saveTabName = () => {
            tabContent.innerText = input.value;
            tab.replaceChild(tabContent, input);
            saveTabsToLocalStorage(tabsWrapper);
        };

        input.addEventListener("blur", saveTabName);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveTabName();
            }
        });

        input.focus();
    });

    // Fermeture de l'onglet
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.cursor = "pointer";
    closeButton.style.marginLeft = "10px";
    closeButton.addEventListener("click", () => {
        tabsWrapper.removeChild(tab);
        saveTabsToLocalStorage(tabsWrapper);
    });

    tab.appendChild(closeButton);
    tabsWrapper.appendChild(tab);

    // Afficher le contenu lié à l'onglet
    tab.addEventListener("click", () => {
        currentTabName = tabContent.innerText;
        contentContainer.innerHTML = '';

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("ContentDiv");
        contentDiv.style.gap = "0px";
        contentDiv.style.width = "100%";

        const menuBar = createMenuBar(); // Appeler createMenuBar sans paramètres car currentTabName est mis à jour
        const menuContentArea = document.createElement("div");
        menuContentArea.classList.add("MenuContentArea");
        menuContentArea.style.width = "100%";

        contentDiv.appendChild(menuBar);
        contentDiv.appendChild(menuContentArea);

        contentContainer.appendChild(contentDiv);
    });

    saveTabsToLocalStorage(tabsWrapper);
}


function loadTabsFromLocalStorage(tabsWrapper, contentContainer) {
    const savedTabs = JSON.parse(localStorage.getItem("tabs")) || [];
    savedTabs.forEach(tabData => {
        createTab(tabsWrapper, contentContainer, tabData.tabName);
    });
}

function saveTabsToLocalStorage(tabsWrapper) {
    const tabs = [];
    tabsWrapper.querySelectorAll("div").forEach(tab => {
        const tabName = tab.querySelector("span").innerText;
        tabs.push({ tabName });
    });

    localStorage.setItem("tabs", JSON.stringify(tabs));
}

function loadMenusFromLocalStorage(tabName, menuWrapper) {
    const savedMenus = JSON.parse(localStorage.getItem("tabMenus")) || {};
    const menus = savedMenus[tabName] || [];
    menuWrapper.innerHTML = ''; // Nettoyer avant de charger les menus

    menus.forEach(menuName => {
        const menu = createMenu(menuName, menuWrapper);
        menuWrapper.appendChild(menu);
    });
}

function saveMenusToLocalStorage(tabName, menuWrapper) {
    if (!(menuWrapper instanceof Element)) {
        console.error("menuWrapper is not a valid DOM element:", menuWrapper);
        return;
    }

    const menus = [];
    menuWrapper.querySelectorAll(".Menu").forEach(menu => {
        menus.push(menu.innerText);
    });

    updateTabMenu(tabName, menus);
}




function createTabs(container) {
    const tabContainer = document.createElement("div");
    tabContainer.classList.add("TabContainer");
    tabContainer.style.border = "1px solid #FFFFFF";
    tabContainer.style.overflowX = "scroll";

    const tabsWrapper = document.createElement("div");

    const contentContainer = document.createElement("div"); // Sous-conteneur pour le contenu des onglets
    contentContainer.classList.add("ContentContainer");
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
            contentDiv.classList.add("ContentDiv")
            contentDiv.style.color = "#ffffff";
            contentDiv.style.display = "flex";
            contentDiv.style.flexGrow = "1";
            contentDiv.style.width = "100%";
            contentDiv.style.height = "100%";
            contentDiv.style.backgroundColor = "#555";
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
        closeButton.style.marginLeft = "5px";
        closeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            tab.remove();
            saveTabsToLocalStorage();  // Sauvegarder les onglets après suppression
        });
    
        tab.appendChild(closeButton);
        tabsWrapper.appendChild(tab);
    };

    // Fonction pour charger les onglets depuis le localStorage
    const loadTabsFromLocalStorage = () => {
        const savedTabs = JSON.parse(localStorage.getItem('tabs'));
        if (savedTabs && savedTabs.length > 0) {
            savedTabs.forEach(text => createTab(text));
        } else {
            createTab();  // Créer un onglet par défaut si aucun onglet n'est trouvé
        }
    };

    container.appendChild(tabContainer);
    tabContainer.appendChild(tabsWrapper);
    container.appendChild(contentContainer);

    loadTabsFromLocalStorage();  // Charger les onglets lors de l'initialisation
}

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
    modalList.style.backgroundColor = "#000000";
    modalList.style.zIndex = "10";
    modalList.style.gap = "0px";
    modalList.style.position = "absolute";
    modalList.style.top = "50%";
    modalList.style.left = "50%";
    modalList.style.transform = "translate(-50%, -50%)";
    // =================================
    // modalList.style.display = "none";
    modalList.style.display = "flex";
    // =================================
    modalList.style.flexDirection = "column";  // Organiser le contenu verticalement

    // Créer le conteneur pour le contenu des onglets
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("ContentContainer")
    contentContainer.style.overflowY = "scroll";
    contentContainer.style.position = "relative";
    contentContainer.style.top = "0px";
    contentContainer.style.color = "#FFFFFF";
    contentContainer.style.height = "100%";
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
    console.log(getTabsAndMenus())
}
