document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      
      document.getElementById("textAccueil").innerText = "Homepage";
      document.getElementById("textLogement").innerText = "Rentals";
      document.getElementById("textCoupsDeCoeur").innerText = "Favourites";

      if (!document.getElementById("user").value){
        document.getElementById("text1").innerText = "Login if you wish";
        document.getElementById("text2").innerText = "to access favourites";
        
        document.getElementById("boutonConnexion").innerText = "Connection";
      } else {
        
      }
      
      
      
      
    }
  });