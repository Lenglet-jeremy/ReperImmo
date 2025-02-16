document.addEventListener("DOMContentLoaded", initMarkupComportement);

function initMarkupComportement() {
    setupEditing(".TabName");
    setupEditing(".Menu p");
    setupDeletion(".DeleteTab");
    setupDeletion(".Menu button");
    setupAdditions();
    setupAnnoncesListees();
    setupCloseListAnnonces();


    loadFromLocalStorage();  // Charger les données sauvegardées
}

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
                saveToLocalStorage();  // Sauvegarde après modification
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
            button.parentElement.remove();
            saveToLocalStorage();  // Sauvegarde après suppression
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
        : `<p>Nouvel Menu</p><button>X</button>`;

    element.innerHTML = content;
    container.appendChild(element);

    setupEditing(type === "tab" ? ".TabName" : ".Menu p");
    setupDeletion(type === "tab" ? ".DeleteTab" : ".Menu button");
    saveToLocalStorage();
}

// 🔹 Sauvegarde dans le LocalStorage
function saveToLocalStorage() {
    const tabNames = Array.from(document.querySelectorAll(".TabName")).map(tab => tab.innerText);
    const menuNames = Array.from(document.querySelectorAll(".Menu p")).map(menu => menu.innerText);

    localStorage.setItem("tabs", JSON.stringify(tabNames));
    localStorage.setItem("menus", JSON.stringify(menuNames));
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


// 🔹 Chargement depuis le LocalStorage
function loadFromLocalStorage() {
    const storedTabs = JSON.parse(localStorage.getItem("tabs")) || ["Onglet 1", "Onglet 2", "Onglet 3"];
    const storedMenus = JSON.parse(localStorage.getItem("menus")) || ["Menu 1", "Menu 2"];

    const tabContainer = document.querySelector(".Tabs");
    const menuContainer = document.querySelector(".Menus");

    tabContainer.innerHTML = "";  
    menuContainer.innerHTML = "";

    storedTabs.forEach(name => {
        let tab = document.createElement("div");
        tab.classList.add("Tab");
        tab.innerHTML = `<p class="TabName">${name}</p><button class="DeleteTab">X</button>`;
        tabContainer.appendChild(tab);
    });

    storedMenus.forEach(name => {
        let menu = document.createElement("div");
        menu.classList.add("Menu");
        menu.innerHTML = `<p>${name}</p><button>X</button>`;
        menuContainer.appendChild(menu);
    });

    setupEditing(".TabName");
    setupEditing(".Menu p");
    setupDeletion(".DeleteTab");
    setupDeletion(".Menu button");
}
