// Charger la path dans l'ID
const components = [
    { path: './Components/MenusBar/MenusBar.html', id: 'MenusBar' },
    { path: './Components/MenuBar/MenuBar.html', id: 'MenuBar' },
    { path: './Components/ToolsBar/ToolsBar.html', id: 'ToolsBar' },
    { path: './Components/Content/Content.html', id: 'Content' },
    { path: './Components/StatusBar/StatusBar.html', id: 'StatusBar' },
];

let menusBarLoaded = false; 

components.forEach(component => {
    fetch(component.path)
        .then(response => response.text())
        .then(data => {
            document.getElementById(component.id).innerHTML = data;

            if (component.id === 'MenusBar' && !menusBarLoaded) {
                menusBarLoaded = true;
                
                const annoncesImmoButton = document.getElementById('AnnoncesImmo');
                const menu2Button = document.getElementById('Menu2');
                const menu3Button = document.getElementById('Menu3');


                if (annoncesImmoButton) {
                    annoncesImmoButton.addEventListener('click', function () {
                        loadMenuBar('./Components/MenuBar/MenuAnnoncesImmo/MenuAnnoncesImmo.html');
                        loadToolBar('./Components/ToolsBar/ToolsBarAnnoncesImmo/ToolsBarAnnoncesImmo.html');
                        loadContent('./Components/Content/ContentAnnoncesImmo/ContentAnnoncesImmo.html');
                        loadStatusBar('./Components/StatusBar/StatusBarAnnoncesImmo/StatusBarAnnoncesImmo.html');
                    });
                }

                if (menu2Button) {
                    menu2Button.addEventListener('click', function () {
                        loadMenuBar('./Components/MenuBar/Menu2/Menu2.html');
                        loadToolBar('./Components/ToolsBar/ToolsBarMenu2/ToolsBarMenu2.html');
                        loadContent('./Components/Content/ContentMenu2/ContentMenu2.html');
                        loadStatusBar('./Components/StatusBar/StatusBarMenu2/StatusBarMenu2.html');
                    });
                }

                if (menu3Button) {
                    menu3Button.addEventListener('click', function () {
                        loadMenuBar('./Components/MenuBar/Menu3/Menu3.html');
                        loadToolBar('./Components/ToolsBar/ToolsBarMenu3/ToolsBarMenu3.html');
                        loadContent('./Components/Content/ContentMenu3/ContentMenu3.html');
                        loadStatusBar('./Components/StatusBar/StatusBarMenu3/StatusBarMenu3.html');
                    });
                }
                // Chargement par d'un menu dés le lancement, rien pour les pages par default
                loadMenuBar('./Components/MenuBar/MenuAnnoncesImmo/MenuAnnoncesImmo.html');
                loadToolBar('./Components/ToolsBar/ToolsBarAnnoncesImmo/ToolsBarAnnoncesImmo.html');
                loadContent('./Components/Content/ContentAnnoncesImmo/ContentAnnoncesImmo.html');
                loadStatusBar('./Components/StatusBar/StatusBarAnnoncesImmo/StatusBarAnnoncesImmo.html');

            }
        })
        .catch(error => console.error(`Erreur lors du chargement de ${component.id} :`, error));
});


function loadMenuBar(path) {
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.getElementById('MenuBar').innerHTML = data;

            if (path.includes('MenuAnnoncesImmo.html')) {
                setupAnnoncesImmo();
            }
        })
        .catch(error => console.error(`Erreur lors du chargement de ${path} :`, error));
}

function loadToolBar(path){
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.getElementById('ToolsBar').innerHTML = data;

            if (path.includes('ToolsBarAnnoncesImmo.html')) {
                initMarkupComportement();
            }
        })
        .catch(error => console.error(`Erreur lors du chargement de ${path} :`, error));
}

function loadContent(path){
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.getElementById('Content').innerHTML = data;

            if (path.includes('ContentAnnoncesImmo.html')) {
                LoadAnnonces();
            }
        })
        .catch(error => console.error(`Erreur:`, error));
}

function loadStatusBar(path){
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.getElementById('StatusBar').innerHTML = data;
        })
        .catch(error => console.error(`Erreur lors du chargement de ${path} :`, error));
}