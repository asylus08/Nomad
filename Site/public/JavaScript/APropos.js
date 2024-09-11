document.addEventListener('DOMContentLoaded', function(){
    langue = document.getElementById("langue").value;
    console.log(langue);
    if (langue == "english"){
      
      document.getElementById("textAccueil").innerText = "Homepage";
      document.getElementById("textLogement").innerText = "Rentals";
      document.getElementById("textCoupsDeCoeur").innerText = "Favourites";
      document.getElementById("textTeam").innerText = "Our team";
      document.getElementById("textDev1").innerText = "Developer";
      document.getElementById("textDev2").innerText = "Developer";
      document.getElementById("textDev3").innerText = "Developer";
      document.getElementById("textDev4").innerText = "Developer";
      
      document.getElementById("textPresentation1").innerText = "We are four students enrolled in computer science at Bois-de-Boulogne College. Our project, Nomad, stems from our desire to create a housing rental platform inspired by popular travel management sites such as Airbnb. Our main goal is to provide an intuitive and user-friendly experience to users by integrating APIs to enhance the functionality of our site. Nomad is much more than just a housing booking platform. It is a comprehensive solution aimed at offering the best prices and an exceptional user experience to travelers worldwide. Nomad users can browse through our extensive catalog of accommodations, filter their searches to find the perfect lodging, and securely make reservations through a user account.";
      document.getElementById("textPresentation2").innerText = "Nomad is much more than just a housing booking platform. It is a comprehensive solution aimed at offering the best prices and an exceptional user experience to travelers worldwide. Nomad users can browse through our extensive catalog of accommodations, filter their searches to find the perfect lodging, and securely make reservations through a user account.";

      
      document.getElementById("textInfoSupp").innerText = "Additional information";

      document.getElementById("textEtablissement").innerText = "Establishment: Bois-de-Boulogne College";
      document.getElementById("textDepartement").innerText = "Department: Computer Science";
      document.getElementById("textTech").innerText = "Technologies used: JavaScript, Node.js, Express.js, MongoDB, HTML/CSS.";
    }
  });