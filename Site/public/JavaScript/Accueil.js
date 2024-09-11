async function fetchLogements() {
    try {
        const response = await fetch('http://localhost:4000/logement-liste'); // Updated URL
        if (!response.ok) {
            throw new Error('Failed to fetch logements');
        }
        const logements = await response.json();
        console.log(logements); // Log fetched data
        return logements;
    } catch (error) {
        console.error(error);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    let currentIndex = 0;
    const logements = await fetchLogements(); // Fetch logements array
    const img = document.getElementById("imgLogement");
    img.src = "https://source.unsplash.com/600x600/?maison";

    function updateLogement(index) {
        const currentLogement = logements[index]; // Access logement directly from the fetched array
        document.getElementById('adresse').innerText = currentLogement.adresse;
        document.getElementById('description').innerText = currentLogement.description;
        document.getElementById('proprietaire').innerText = currentLogement.nom_proprietaire;
        document.getElementById('emplacement').innerText = currentLogement.destination;
        document.getElementById('prix').innerText = currentLogement.prix + "$";
        document.getElementById('nombreChambre').innerText = currentLogement.nombreChambre;
        document.getElementById('nombrePersonnes').innerText = currentLogement.nombrePersonnes;
        img.src = "https://source.unsplash.com/600x600/?" + currentLogement.adresse; // Update image source
    }

    function navigateLeft() {
        currentIndex = (currentIndex - 1 + logements.length) % logements.length;
        updateLogement(currentIndex);
    }

    function navigateRight() {
        currentIndex = (currentIndex + 1) % logements.length;
        updateLogement(currentIndex);
    }

    document.querySelector('.navArrow.left').addEventListener('click', navigateLeft);
    document.querySelector('.navArrow.right').addEventListener('click', navigateRight);

    document.querySelector('.logementInfo').addEventListener('click', function(event) {
       
        const logementId = logements[currentIndex]._id;
        window.location.href = "/information/" + logementId;
    });

    updateLogement(currentIndex);

    console.log(logements[currentIndex]._id);
});

document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      document.getElementById("texte").innerText = "Welcome to Nomad! This website is a rental platform that offers the best prices for eager travelers. As a Nomad user, you'll be able to browse through the extensive catalog of available accommodations worldwide with just a few clicks.";
      document.getElementById("textAccueil").innerText = "Homepage";
      document.getElementById("textLogement").innerText = "Rentals";
      document.getElementById("textCoupsDeCoeur").innerText = "Favourites";
      document.getElementById("bestSellers").innerText = "Best Sellers";
      document.getElementById("descriptionText").innerText = "Description";
      document.getElementById("proprioText").innerText = "Owner";
      document.getElementById("emplacementText").innerText = "Location";
      document.getElementById("prixText").innerText = "Price";
      document.getElementById("nbChambreText").innerText = "Number of rooms :";
      
      document.getElementById("nbPersonnesText").innerText = "Maximum occupancy :";
      document.getElementById("boutonDetails").innerText = "Check details";
      
    }
});   