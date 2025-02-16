function setupAnnoncesImmo() {
    const choiceSelector = document.getElementById('SortChoice');

    if (choiceSelector) {
        // Ajoutez un gestionnaire d'événements pour détecter les changements
        choiceSelector.addEventListener('change', (event) => {
            console.log(`Option sélectionnée : ${event.target.value}`);
        });
    } 
    else {
        console.error('Impossible de trouver l\'élément <select> avec l\'ID "Choice".');
    }
}