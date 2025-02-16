function initMarkupComportement() {
    setupEditing(".TabName");
    setupEditing(".Menu p");
    setupDeletion(".DeleteTab");
    setupDeletion(".Menu button");
    setupAdditions();
    setupAnnoncesListees();
    setupCloseListAnnonces();
    loadFromLocalStorage();
}

let tabData = {};
let tabCount = 0;

function setupEditing(selector) {
    document.querySelectorAll(selector).forEach(element => {
        element.addEventListener("dblclick", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = element.innerText;
            input.style.flexGrow = "1";

            const oldTabName = element.innerText.trim();

            input.addEventListener("blur", () => {
                const newTabName = input.value.trim();
                element.innerText = newTabName;
                input.replaceWith(element);

                // Copy the content from the old tab name to the new tab name
                if (oldTabName !== newTabName) {
                    tabData[newTabName] = tabData[oldTabName];
                    delete tabData[oldTabName];
                }

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


function setupDeletion(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener("click", () => {
            const parent = button.parentElement;
            if (parent.classList.contains("Tab")) {
                const tabName = parent.querySelector(".TabName").innerText.trim();
                delete tabData[tabName];
            }
            parent.remove();
            saveToLocalStorage();
        });
    });
}

function setupAdditions() {
    document.querySelector(".AddTabButton button").addEventListener("click", () => addNewElement("tab"));
    document.querySelector(".MenusControlPanel button").addEventListener("click", () => addNewElement("menu"));
}

function addNewElement(type) {
    const container = type === "tab" ? document.querySelector(".Tabs") : document.querySelector(".Menus");
    const element = document.createElement("div");
    element.classList.add(type === "tab" ? "Tab" : "Menu");
    tabCount++;
    const content = type === "tab"
        ? `<p class="TabName">Nouvel Onglet ${tabCount}</p><button class="DeleteTab">X</button>`
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

        if (!tabData[tabName]) {
            tabData[tabName] = { menus: {}, selectedMenu: null };
        }

        const menuName = `Menu ${Object.keys(tabData[tabName].menus).length + 1}`;
        tabData[tabName].menus[menuName] = "Contenu par défaut";
        updateMenuDisplay(tabName);
    }

    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem("tabData", JSON.stringify(tabData));
}

function loadFromLocalStorage() {
    tabData = JSON.parse(localStorage.getItem("tabData")) || {};
    const tabContainer = document.querySelector(".Tabs");
    tabContainer.innerHTML = "";

    Object.keys(tabData).forEach(tabName => {
        const tab = document.createElement("div");
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

function activateTab(tabElement) {
    document.querySelectorAll(".Tab").forEach(tab => tab.classList.remove("active"));
    tabElement.classList.add("active");

    const tabName = tabElement.querySelector(".TabName").textContent.trim();

    if (!tabData[tabName]) {
        tabData[tabName] = { menus: {}, selectedMenu: null };
    }

    updateMenuDisplay(tabName);
}

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

            const menuNameElement = menuElement.querySelector("p");
            menuNameElement.addEventListener("click", () => {
                tabData[tabName].selectedMenu = menu;
                updateMenuContent(tabName);
            });

            // Add double-click event listener to rename the menu
            menuNameElement.addEventListener("dblclick", () => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = menuNameElement.innerText;
                input.style.flexGrow = "1";

                const oldMenuName = menuNameElement.innerText.trim();

                input.addEventListener("blur", () => {
                    const newMenuName = input.value.trim();
                    menuNameElement.innerText = newMenuName;
                    input.replaceWith(menuNameElement);

                    // Copy the content from the old menu name to the new menu name
                    if (oldMenuName !== newMenuName) {
                        tabData[tabName].menus[newMenuName] = tabData[tabName].menus[oldMenuName];
                        delete tabData[tabName].menus[oldMenuName];
                        tabData[tabName].selectedMenu = newMenuName;
                    }

                    saveToLocalStorage();
                });

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") input.blur();
                });

                menuNameElement.replaceWith(input);
                input.focus();
            });
        });
    }
}


function updateMenuContent(tabName) {
    const menuContentElement = document.querySelector(".MenuContent p");
    const selectedMenu = tabData[tabName].selectedMenu;

    if (selectedMenu) {
        const contentMessage = `Contenu du menu ${selectedMenu} de l'onglet ${tabName}`;
        menuContentElement.innerText = contentMessage;

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


function setupAnnoncesListees() {
    document.querySelector(".AnnoncesListees").addEventListener("click", () => {
        document.querySelector(".ListAnnonceInterface").style.display = "flex";
    });
}

function setupCloseListAnnonces() {
    document.querySelector(".CloseListAnnonces").addEventListener("click", () => {
        document.querySelector(".ListAnnonceInterface").style.display = "none";
    });
}
