document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    
    
    console.log(langue);
    if (langue == "english"){
      
          document.getElementById("titreModif").innerText = "Edit a Property";
          document.getElementById("textAdresse").innerText = "Address";
          document.getElementById("adresse").innerText = "The location submitted is not valid!";
          document.getElementById("textVille").innerText = "City";
          document.getElementById("ville").innerText = "The information submitted is not valid!";
          document.getElementById("textRegion").innerText = "Region";
          document.getElementById("region").innerText = "The information submitted is not valid!";
          document.getElementById("textCodePostal").innerText = "Postal code"; 
          document.getElementById("code_postal").title = "The information submitted is not valid!";
          
          document.getElementById("textPrix").innerText = "Price";
          
        
          document.getElementById("textNbPersonnes").innerText = "Number of people";
          document.getElementById("textNbChambres").innerText = "Number of rooms";
          document.getElementById("textDispo").innerText = "Availability";
          document.getElementById("boutonModif").innerText = "Edit the property";
          
        
      
      
      
      
      
    }
  });