function openPopup() {
  if (document.getElementById("popup").style.display != "block") {
    document.getElementById("popup").style.display = "block";
  } else {
    document.getElementById("popup").style.display = "none";
  }

}


document.addEventListener("DOMContentLoaded", function () {
  var slider = document.getElementById("slider");
  var output = document.getElementById("valeur");
  output.innerHTML = slider.value + "$";

  slider.oninput = function () {
    output.innerHTML = this.value + "$";
  }
});

document.addEventListener('DOMContentLoaded', function () {
  langue = document.getElementById("langue").value;
  console.log(langue);
  if (langue == "english") {

    document.getElementById("textAccueil").innerText = "Homepage";
    document.getElementById("textLogement").innerText = "Rentals";
    document.getElementById("textCoupsDeCoeur").innerText = "Favourites";
    document.getElementById("textChambres").innerText = "Number of rooms";
    document.getElementById("textPersonnes").innerText = "Number of people";

    document.getElementById("textFiltres").innerText = "Filters";
    document.getElementById("titreFiltres").innerText = "Filters";
    document.getElementById("textPrix").innerText = "Price";
    document.getElementById("textEnregistrer").innerText = "Submit";
    document.getElementById("textReinitialiser").innerText = "Reset";
  }
});

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

document.addEventListener('DOMContentLoaded', async function () {
  const logements = await fetchLogements();
  var logementPresent = logements;

  const boutonRecherche = document.getElementById('boutonRecherche');
  const boutonFiltre = document.getElementById('textEnregistrer');

  boutonRecherche.addEventListener('click', function Recherche() {
    const numChambre = parseInt(document.getElementById('numChambre').value);
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const destination = document.getElementById('destination').value;

    logementPresent = []

    logements.forEach(logement => {
      const logementElement = document.getElementById(logement._id);
      if (logement.nombreChambre >= numChambre && logement.nombrePersonnes >= numPeople && logement.destination == destination) {
        logementElement.style.display = "inline-block";
        logementPresent.push(logement);
      } else {
        logementElement.style.display = "none";
      }
    });
  });

  boutonFiltre.addEventListener('click', function Filtre() {
    const prix = parseInt(document.getElementById('slider').value);


    logementPresent.forEach(logement => {
      const logementElement = document.getElementById(logement._id);
      if (logement.prix <= prix) {
        logementElement.style.display = "inline-block";
      } else {
        logementElement.style.display = "none";
      }
    });
    openPopup();
  });
});