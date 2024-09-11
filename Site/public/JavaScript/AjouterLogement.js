//Autocomplétion des champs de l'adresse
var options = {
  apiKey: '989b92f1e2f2df68a76b2e9ac',
  country: 'ca'
};
slpy.addressAutocomplete("checkout-form", options);

document.addEventListener('DOMContentLoaded', function(){
  langue = document.getElementById("langue").value;
  
  
  console.log(langue);
  if (langue == "english"){
    
        document.getElementById("titreAjout").innerText = "Add a Property";
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
        document.getElementById("boutonAjout").innerText = "Add the property";
        
      
    
    
    
    
    
  }
});