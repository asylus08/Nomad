document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    user = document.getElementById("user").value;
    
    logement = document.getElementById("logement").value;
    console.log(langue);
    if (langue == "english"){
      
        if(user == false || !user){
          
            document.getElementById("textErreurProprio1").innerText = "You are not yet an owner.";
            document.getElementById("textErreurProprio2").innerText = "Would you like to join Nomad+ and become one?";
            document.getElementById("boutonProprio").innerText = "Become an owner";
        }else if(logement.length != 0){
          document.getElementById("textStats").innerText = "Statistics";
          document.getElementById("textPasRevenus").innerText = "You don't have any earnings yet";
          document.getElementById("local").innerText = "Add a rental property";
          document.getElementById("textTitreLogements").innerText = "Your properties";
          
          document.getElementById("TextAdresse").innerText = "Adress";
          for (var i=0; i<logement.length; i++){
            document.getElementById(`BoutonModifier_${i}`).innerText = "Modify";
                document.getElementById(`BoutonSupprimer_${i}`).innerText = "Delete";
          }
          
        }else{
          document.getElementById("textStats").innerText = "Statistics";
          document.getElementById("textPasRevenus").innerText = "You don't have any earnings yet";
          document.getElementById("textNoLogements").innerText = "You haven't listed any rental properties yet. You can do so below.";
          document.getElementById("boutonAjout").innerText = "Add a rental property";
          
        }
      
      
      
      
      
    }
  });