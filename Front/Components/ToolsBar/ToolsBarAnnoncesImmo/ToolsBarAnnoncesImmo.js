function initMarkupComportement() {
    setupEditing(".TabName");
    setupEditing(".Menu p");
    setupDeletion(".DeleteTab");
    setupDeletion(".Menu button");
    setupAdditions();
    setupAnnoncesListees();
    setupCloseListAnnonces();
    loadFromLocalStorage(); // Charger les données sauvegardées
}

// 🔹 Stockage des menus et contenus pour chaque onglet
let tabData = {};

// 🔹 Gérer l'édition des éléments (onglets et menus)
function setupEditing(selector) {
    document.querySelectorAll(selector).forEach(element => {
        element.addEventListener("dblclick", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = element.innerText;
            input.style.flexGrow = "1";

            input.addEventListener("blur", () => {
                element.innerText = input.value;
                input.replaceWith(element);
                saveToLocalStorage();
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") input.blur();
            });

            element.replaceWith(input);
            input.focus();
        });
    });
}

// 🔹 Gérer la suppression des éléments
function setupDeletion(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener("click", () => {
            const parent = button.parentElement;
            if (parent.classList.contains("Tab")) {
                const tabName = parent.querySelector(".TabName").innerText.trim();
                delete tabData[tabName]; // Supprimer les menus liés à l'onglet
            }
            parent.remove();
            saveToLocalStorage();
        });
    });
}

// 🔹 Ajouter un nouvel onglet ou menu
function setupAdditions() {
    document.querySelector(".AddTabButton button").addEventListener("click", () => addNewElement("tab"));
    document.querySelector(".MenusControlPanel button").addEventListener("click", () => addNewElement("menu"));
}

function addNewElement(type) {
    let container = type === "tab" ? document.querySelector(".Tabs") : document.querySelector(".Menus");
    let element = document.createElement("div");
    element.classList.add(type === "tab" ? "Tab" : "Menu");

    let content = type === "tab"
        ? `<p class="TabName">Nouvel Onglet</p><button class="DeleteTab">X</button>`
        : `<p>Nouvel Menu</p><button class="deleteMenu">X</button>`;

    element.innerHTML = content;
    container.appendChild(element);

    setupEditing(type === "tab" ? ".TabName" : ".Menu p");
    setupDeletion(type === "tab" ? ".DeleteTab" : ".Menu button");

    if (type === "tab") {
        const tabName = element.querySelector(".TabName").innerText.trim();
        tabData[tabName] = { menus: {}, selectedMenu: null };
        element.addEventListener("click", () => activateTab(element));
        activateTab(element);
    } else {
        const activeTab = document.querySelector(".Tab.active");
        if (!activeTab) return;
        const tabName = activeTab.querySelector(".TabName").innerText.trim();
        const menuName = `Menu ${Object.keys(tabData[tabName].menus).length + 1}`;
        tabData[tabName].menus[menuName] = "Contenu par défaut";
        updateMenuDisplay(tabName);
    }

    saveToLocalStorage();
}

// 🔹 Sauvegarde dans le LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("tabData", JSON.stringify(tabData));
}

// 🔹 Chargement depuis le LocalStorage
function loadFromLocalStorage() {
    tabData = JSON.parse(localStorage.getItem("tabData")) || {};

    const tabContainer = document.querySelector(".Tabs");
    tabContainer.innerHTML = "";

    Object.keys(tabData).forEach(tabName => {
        let tab = document.createElement("div");
        tab.classList.add("Tab");
        tab.innerHTML = `<p class="TabName">${tabName}</p><button class="DeleteTab">X</button>`;
        tab.addEventListener("click", () => activateTab(tab));
        tabContainer.appendChild(tab);
    });

    if (Object.keys(tabData).length > 0) {
        activateTab(document.querySelector(".Tab"));
    }

    setupEditing(".TabName");
    setupDeletion(".DeleteTab");
}

// 🔹 Activation d'un onglet et mise à jour des menus associés
function activateTab(tabElement) {
    document.querySelectorAll(".Tab").forEach(tab => tab.classList.remove("active"));
    tabElement.classList.add("active");

    const tabName = tabElement.querySelector(".TabName").textContent.trim();
    updateMenuDisplay(tabName);
}

// 🔹 Mise à jour des menus pour l'onglet actif
function updateMenuDisplay(tabName) {
    const menusContainer = document.querySelector(".ListAnnonceMenus .Menus");
    menusContainer.innerHTML = ""; 

    if (tabData[tabName]) {
        Object.keys(tabData[tabName].menus).forEach(menu => {
            const menuElement = document.createElement("div");
            menuElement.classList.add("Menu");
            menuElement.innerHTML = `<p>${menu}</p> <button class="deleteMenu">X</button>`;
            menusContainer.appendChild(menuElement);

            menuElement.querySelector(".deleteMenu").addEventListener("click", () => {
                delete tabData[tabName].menus[menu];
                updateMenuDisplay(tabName);
                saveToLocalStorage();
            });

            menuElement.querySelector("p").addEventListener("click", () => {
                tabData[tabName].selectedMenu = menu;
                updateMenuContent(tabName);
            });
        });
    }
}

// 🔹 Mise à jour du contenu affiché pour le menu sélectionné
function updateMenuContent(tabName) {
    const menuContentElement = document.querySelector(".MenuContent p");
    const selectedMenu = tabData[tabName].selectedMenu;

    if (selectedMenu) {
        menuContentElement.innerText = tabData[tabName].menus[selectedMenu];

        menuContentElement.addEventListener("dblclick", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = menuContentElement.innerText;
            input.style.flexGrow = "1";

            input.addEventListener("blur", () => {
                tabData[tabName].menus[selectedMenu] = input.value;
                menuContentElement.innerText = input.value;
                input.replaceWith(menuContentElement);
                saveToLocalStorage();
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") input.blur();
            });

            menuContentElement.replaceWith(input);
            input.focus();
        });
    } else {
        menuContentElement.innerText = "Sélectionnez un menu";
    }
}

// 🔹 Gérer l'affichage de ListAnnonceInterface
function setupAnnoncesListees() {
    document.querySelector(".AnnoncesListees").addEventListener("click", () => {
        document.querySelector(".ListAnnonceInterface").style.display = "flex";
    });
}

// 🔹 Gérer la fermeture de ListAnnonceManager
function setupCloseListAnnonces() {
    document.querySelector(".CloseListAnnonces").addEventListener("click", () => {
        document.querySelector(".ListAnnonceInterface").style.display = "none";
    });
}
