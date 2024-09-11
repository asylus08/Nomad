document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      
      document.getElementById("textConnexionPage").innerText = "Log in";
      document.getElementById("textCourriel").innerText = "Email";
      document.getElementById("textMDP").innerText = "Password";
      document.getElementById("textErreur").innerText = "*If you don't have an account";
      document.getElementById("textInscriptionLien").innerText = "Sign up";
      
      document.getElementById("textBoutonConnexion").innerText = "Login";
      
      
      
    }
  });