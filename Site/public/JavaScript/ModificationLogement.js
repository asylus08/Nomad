document.addEventListener('DOMContentLoaded', function(){
    var geocode = document.getElementById("geocode").value;
    var localisation = geocode.split(",");
    document.getElementById("ville").value = localisation[1];
    document.getElementById("region").value = localisation[2];
    document.getElementById("code_postal").value = localisation[3];
});