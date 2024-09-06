document.addEventListener('DOMContentLoaded', function () {
    loadPartial('sidebar', './1.0.sideBar/1.0.sideBar.html');
    loadPartial('toolsMenu', './2.0.toolsMenu/1.0.toolsMenu.html');
    loadPartial('toolsBar', './3.0.toolsBar/1.0.toolsBar.html', gestionAnnonces);
    loadPartial('content', './4.0.content/1.0.content.html', loadAnnonces); // Chargement des annonces après l'injection du contenu
});

function loadPartial(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) callback();
        });
}
