function ouvrirOption() {  
    var popupCompte = document.getElementById("popupCompte");
    if (popupCompte.style.display === "none" || popupCompte.style.display === "") {
      popupCompte.style.display = "block";
    } else {
      popupCompte.style.display = "none";
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var currentURL = window.location.href;
    var form = document.getElementById("myForm");
    var pageTitle = document.getElementById("pageTitle").value;
    if (pageTitle == "information"){
      
      
      var index = currentURL.indexOf("information/");
      var id = currentURL.substring(index + "information/".length);
      console.log(id);
      form.action = "/changer-langue/"+ pageTitle + "/" + id + "/0" + "/0";
    } else if (pageTitle == "Modif logement"){
      var index = currentURL.indexOf("logement/edit/");
      var idProprio = currentURL.substring(index + "logement/edit/".length);
      console.log(id);
      form.action = "/changer-langue/"+ pageTitle + "/0" + "/0" + "/" + idProprio;
    
    } else if (pageTitle == "Transaction"){
      var prixTotal = document.getElementById("prixTotalInput").value;
      form.action = "/changer-langue/"+ pageTitle + "/0/" + prixTotal + "/0";
    } 
    
    else {
      form.action = "/changer-langue/"+ pageTitle + "/0" + "/0" + "/0";
    }
    
      
      //form.action = "/changer-langue/" + newURL;
    
    
    

    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      if (!document.getElementById("user").value){
        document.getElementById("textConnexion").innerText = "Login";
        document.getElementById("textInscription").innerText = "Sign up";
      } else {
        document.getElementById("textInfoCompte").innerText = "Account";
        document.getElementById("textDeconnexion").innerText = "Log off";
      }
      document.querySelector(".flag").src = '/public/images/uk.jpg';
      document.getElementById("textAPropos").innerText = "About us";      
    }

});



  