function confirmerSupression() {
    if (document.getElementById("supprimerCompte").style.display != "block") {
        document.getElementById("supprimerCompte").style.display = "block";
    } else {
        document.getElementById("supprimerCompte").style.display = "none";
    }

}

function modifierInformation() {
    var inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.readOnly = false;
    });
    document.getElementById("boutonModifier").style.display = "none";
    document.getElementById("boutonSupprimer").style.display = "none";
    document.getElementById("boutonMDP").style.display = "none"
    document.getElementById("buttonModifier").style.display = "block";
    document.getElementById("TexteModif").style.display = "block";    
}

function confirmerChangement(){
    if (document.getElementById("changerMDP").style.display != "block") {
        document.getElementById("changerMDP").style.display = "block";
    } else {
        document.getElementById("changerMDP").style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    proprio = document.getElementById("proprio").value;
    
    console.log(langue);
    if (langue == "english"){
          document.getElementById("texteTitre").innerText = "Your account";
          document.getElementById("TexteModif").innerText = "Edit your information";
          
          document.getElementById("textePrenom").innerText = "User's first name";
          document.getElementById("prenom").placeholder = "Example";
          document.getElementById("prenom").title = "Enter your first name";
          
          document.getElementById("texteNom").innerText = "User's last name";
          document.getElementById("nom").placeholder = "Example";
          document.getElementById("nom").title = "Enter your last name";
          
          document.getElementById("texteCourriel").innerText = "Email"; 
          document.getElementById("EMAIL").placeholder = "example@gmail.com";
          document.getElementById("EMAIL").title = "Please follow that format : example@example.ca";

          document.getElementById("texteTelephone").innerText = "Phone number";
          document.getElementById("num_tel").title = "Please follow that format : 000 000 0000";
        
          document.getElementById("texteNomad+").innerText = "Member of Nomad+";
          if(proprio == true){
            document.getElementById("texteProprio").innerText = "Yes";   
          }else{
            document.getElementById("texteProprio").innerText = "No";
          }
          document.getElementById("buttonModifier").innerText = "Submit changes";

          document.getElementById("boutonModifier").innerText = "Edit your information";
          document.getElementById("boutonMDP").innerText = "Edit your password";
          document.getElementById("boutonSupprimer").innerText = "Delete your account";


          document.getElementById("texteConfirmation").innerText = "Please enter your password to delete your account";
          document.getElementById("boutonConfirmer1").innerText = "Confirm";
          document.getElementById("boutonCancel1").innerText = "Cancel";
          document.getElementById("texteNouveauMdp").innerText = "Please enter your new password";
          document.getElementById("boutonConfirmer2").innerText = "Confirm";
          document.getElementById("boutonCancel2").innerText = "Cancel";

          document.getElementById("texteTransactions").innerText = "Your transactions";
          document.getElementById("textNumTransaction").innerText = "Transaction Number";
          document.getElementById("textDateTransaction").innerText = "Date (yyyy-mm-dd)";
      
      
      
      
      
    }
  });