document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      
      document.getElementById("textTitreInscription").innerText = "Registration form";
      document.getElementById("textNomUser").innerText = "User's last name";
      document.getElementById("nom").placeholder = "Example";
      document.getElementById("textPrenomUser").innerText = "User's first name";
      document.getElementById("prenom").placeholder = "Example";
      document.getElementById("textEmail").innerText = "Email";
      document.getElementById("EMAIL").placeholder = "example@gmail.com";
      document.getElementById("textPassword").innerText = "Password (Min 8 characters)";
      
      document.getElementById("textNumeroTelephone").innerText = "Phone number";
      document.getElementById("boutonInscription").innerText = "Sign in";
      document.getElementById("textErreur").innerText = "*If you already have an account";
      document.getElementById("lienLogin").innerText = "Login";
      
      
      
    }
  });