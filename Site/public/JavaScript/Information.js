

document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      
      document.getElementById("textAccueil").innerText = "Homepage";
      document.getElementById("textLogement").innerText = "Rentals";
      document.getElementById("textCoupsDeCoeur").innerText = "Favourites";
      
        if (!document.getElementById("user").value)
            {
                document.getElementById("lienConnexion").innerText = "Login to add favourites";
            } else {
                document.getElementById("boutonFavoris").innerText = "Add to favourites";
            }
      
      
      document.getElementById("emplacementText").innerText = "Location";
      document.getElementById("descriptionText").innerText = "Description";
      document.getElementById("proprioText").innerText = "Owner";
      document.getElementById("emplacementText").innerText = "Location";
      document.getElementById("prixText").innerText = "Price";
      document.getElementById("nbChambreText").innerText = "Number of rooms :";
      
      document.getElementById("nbPersonnesText").innerText = "Maximum occupancy :";
      document.getElementById("textDateArrivee").innerText = "Arrival date";
      document.getElementById("textDateDepart").innerText = "Departure date";
      document.getElementById("reserverBtn").innerText = "Confirm";
      
    }
});