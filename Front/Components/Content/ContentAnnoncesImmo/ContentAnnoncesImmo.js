function AnnonceImmoTemplate(annonce) {
    let currentIndex = 0;
    let slides = annonce.querySelectorAll(".Slide");
    let dots = annonce.querySelectorAll(".Dot");
    let prevButton = annonce.querySelector(".PrevButton");
    let nextButton = annonce.querySelector(".NextButton");

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.style.opacity = index === currentIndex ? "1" : "0";
        });

        dots.forEach((dot, index) => {
            dot.style.backgroundColor = index === currentIndex ? "#00FF00" : "#000000";
        });
    }

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    dots.forEach((dot, index) => {
        dot.setAttribute("data-index", index);
        dot.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.getAttribute("data-index"));
            updateCarousel();
        });
    });

    updateCarousel();

    return annonce;
}

async function getdata(route) {
    try {
        let response = await fetch(route);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
        return [];
    }
}


async function LoadAnnonces() {
    let annoncesContainer = document.querySelector(".ContentAnnoncesImmo");
    let templateAnnonce = document.querySelector(".Annonce");

    let annonces = await getdata("http://localhost:5000/lbc");
    console.log(annonces.length);

    for (let i = 0; i < annonces.length; i++) {
        let annonceClone = templateAnnonce.cloneNode(true);

        // Titre
        let Title = annonceClone.querySelector(".TitleAnnonce");
        Title.textContent = annonces[i].subject;

        // Prix
        let cost = annonceClone.querySelector(".Cost");
        cost.textContent = annonces[i].price[0].toLocaleString() + ' €';

        // Prix au m²
        let squareCost = annonceClone.querySelector(".SquareCost");
        const pricePerSquareMeter = annonces[i].attributes.find(attr => attr.key === "price_per_square_meter");
        squareCost.textContent = pricePerSquareMeter ? Number(pricePerSquareMeter.value_label).toLocaleString() + " €/m²" : "Non spécifié";

        // Surface
        let surfaceMarkUp = annonceClone.querySelector(".Surface")
        const surfaceValue = annonces[i].attributes.find(attr => attr.key === "square");
        surfaceMarkUp.textContent = surfaceValue ? Number(surfaceValue.value).toLocaleString() + " m²" : "Non spécifié";

        // Nombre de pieces
        let nbRoomsMarkUp = annonceClone.querySelector(".NbRooms")
        const nbRoomsValue = annonces[i].attributes.find(attr => attr.key === "rooms");
        nbRoomsMarkUp.textContent = nbRoomsValue ? nbRoomsValue.value + " Pieces" : "Non spécifié";

        // Type de bien
        let typeOfPropertyMarkUp = annonceClone.querySelector(".TypeOfPropertyMarkUp")
        const typeOfPropertyValue = annonces[i].attributes.find(attr => attr.key_label === "Type de bien");
        typeOfPropertyMarkUp.textContent = typeOfPropertyValue ? typeOfPropertyValue.value_label : "Non spécifié";

        // Neuf ou Occasion
        let newOccasionMarkUp = annonceClone.querySelector(".NewOccasion")
        const newOccasionValue = annonces[i].attributes.find(attr => attr.key === "immo_sell_type");
        newOccasionMarkUp.textContent = newOccasionValue ? (newOccasionValue.value === "old" ? "Ancien" : "Neuf") : "Non spécifié";

        // Ville
        let locationMarkUp = annonceClone.querySelector(".CityAnnonce");
        locationMarkUp.textContent = annonces[i].location.city;

        // DPE
        let DPEMarkUp = annonceClone.querySelector(".DPE")
        const DPEValue = annonces[i].attributes.find(attr => attr.key_label === "Classe énergie");
        DPEMarkUp.textContent = DPEValue ? "DPE : " + DPEValue.value_label : "DPE : Inconnu";

        // GES
        let GESMarkUp = annonceClone.querySelector(".GES")
        const GESValue = annonces[i].attributes.find(attr => attr.key_label === "GES");
        GESMarkUp.textContent = GESValue ? "GES : " + GESValue.value_label : "GES : Inconnu";

        // Mise a jour source
        let UpdateSourceMarkUp = annonceClone.querySelector(".UpdateSource");
        UpdateSourceMarkUp.textContent = annonces[i].index_date.split(" ")[0];

        // Mise a jour Reperimmo
        let UpdateReperimmoMarkUp = annonceClone.querySelector(".UpdateReperimmo");
        UpdateReperimmoMarkUp.textContent = new Date().toLocaleDateString("fr-FR");

        // Lien vers annonce
        let linkMarkUp = annonceClone.querySelector(".LinkValue");
        linkMarkUp.href = annonces[i].url;

        // Génération dynamique des slides et dots
        let carouselInner = annonceClone.querySelector(".CarouselInner");
        let indicators = annonceClone.querySelector(".Indicators");

        // Clear existing slides and dots
        carouselInner.innerHTML = '';
        indicators.innerHTML = '';

        annonces[i].images.urls.forEach((url, index) => {
            let slide = document.createElement("div");
            slide.classList.add("Slide");
            slide.style.opacity = index === 0 ? "1" : "0";
            slide.innerHTML = `<img class="Image" src="${url}" alt="Image ${index + 1}">`;
            carouselInner.appendChild(slide);

            let dot = document.createElement("div");
            dot.classList.add("Dot");
            dot.setAttribute("data-index", index);
            indicators.appendChild(dot);
        });

        annonceClone.style.display = "block";
        annoncesContainer.appendChild(AnnonceImmoTemplate(annonceClone));

        // Add event listener to the "+" button
        annonceClone.querySelector(".AddToListButton").addEventListener("click", () => {
            showMenuSelectionPopup(annonceClone);
        });
    }
}

function showMenuSelectionPopup(annonce) {
    // Create a popup container
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("MenuSelectionPopup");
    popupContainer.style.position = "fixed";
    popupContainer.style.top = "50%";
    popupContainer.style.left = "50%";
    popupContainer.style.transform = "translate(-50%, -50%)";
    popupContainer.style.backgroundColor = "white";
    popupContainer.style.border = "1px solid #ccc";
    popupContainer.style.padding = "20px";
    popupContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    popupContainer.style.zIndex = "1000";
    popupContainer.style.maxHeight = "80vh";
    popupContainer.style.overflowY = "auto";

    const title = document.createElement("h3");
    title.textContent = "Sélectionnez un menu";
    popupContainer.appendChild(title);

    const menuList = document.createElement("ul");

    // Iterate over all tabs and their menus
    Object.keys(tabData).forEach(tabName => {
        const tabMenus = tabData[tabName].menus;
        Object.keys(tabMenus).forEach(menu => {
            const menuItem = document.createElement("li");
            menuItem.textContent = `${tabName} - ${menu}`;
            menuItem.style.cursor = "pointer";
            menuItem.style.padding = "10px";
            menuItem.style.borderBottom = "1px solid #eee";

            menuItem.addEventListener("click", () => {
                // Add the announcement to the selected menu's list
                if (!Array.isArray(tabData[tabName].menus[menu])) {
                    tabData[tabName].menus[menu] = [];
                }
                tabData[tabName].menus[menu].push(annonce.outerHTML);
                updateMenuContent(tabName); // Call the existing function
                saveToLocalStorage();
                popupContainer.remove();
            });

            menuList.appendChild(menuItem);
        });
    });

    popupContainer.appendChild(menuList);

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Fermer";
    closeButton.style.marginTop = "20px";
    closeButton.addEventListener("click", () => {
        popupContainer.remove();
    });
    popupContainer.appendChild(closeButton);

    document.body.appendChild(popupContainer);
}
