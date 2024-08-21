document.addEventListener('DOMContentLoaded', function () {
    loadPartial('sidebar', './Front/1.0.sideBar/1.0.sideBar.html');
    loadPartial('toolsMenu', './Front/2.0.toolsMenu/1.0.toolsMenu.html');
    loadPartial('toolsBar', './Front/3.0.toolsBar/1.0.toolsBar.html');
    loadPartial('content', './Front/4.0.content/1.0.content.html');
});

function loadPartial(id, url, callback) {
    fetch(url).then(response => response.text())
              .then(data => {
                  document.getElementById(id).innerHTML = data;
                  if (callback) callback();
              });
}
