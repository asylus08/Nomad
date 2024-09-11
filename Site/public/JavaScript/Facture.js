document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    
    if (langue == "english"){
      
      
      
  
      document.getElementById("textDetailsTransaction").innerText = "Breakdown of transaction";
      document.getElementById("textDetailsFrais").innerText = "Breakdown of charges";
      document.getElementById("textMontant").innerText = "Accommodation fee";
      document.getElementById("textNettoyage").innerText = "Cleaning fee";
      document.getElementById("textService").innerText = "Nomad service fee";
      document.getElementById("boutonPayer").value = "Pay";
      
      
    }
  });