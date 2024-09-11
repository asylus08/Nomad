$(document).ready(function () {
    var prixElement = document.getElementById("prixR");
    var buttonConfirmer = document.getElementById("reserverBtn");
    var user = document.getElementById("user").value;
    var form = document.getElementById("reserver");
    buttonConfirmer.disabled = true;
    $('#datepicker1, #datepicker2').on('change', function () {
        var prix1 = document.getElementById("hiddenPrix").value;
        calculer(prix1);
    });

    function calculer(prix1) {
        var date1 = document.getElementById("datepicker1").value;
        var date2 = document.getElementById("datepicker2").value;

        console.log(date1);
        console.log(date2);
        var d1 = new Date(date1.replace(/-/g, '\/'));
        var d2 = new Date(date2.replace(/-/g, '\/'));
        console.log(d1);
        var timeDiff = d2 - d1;

        if (date2 > date1) {

            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var prixTotal = diffDays * Number(prix1);
            console.log(prixTotal);

            document.getElementById("prixTotalInput").value = prixTotal;
            // result. = 'Number of days between the selected dates: ' + diffDays;
            prixElement.innerText = String(prixTotal) + "$";
            console.log(prixElement.innerText);
            result.textContent = "";
            // return prixTotal;

            if (user) {
                buttonConfirmer.disabled = false;
            }
            form.action = "/transaction/" + prixTotal;


        } else {
            buttonConfirmer.disabled = true;
            form.action = "/transaction/0";
        }
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const aujourdhui = new Date().toISOString().split('T')[0];
    var demain = new Date(aujourdhui);
    const dateDebut = document.getElementById('datepicker1');
    const dateFin = document.getElementById('datepicker2');

    dateDebut.value = aujourdhui;

    // Initialise la date minimum a selectionner a aujhourdhui
    dateDebut.setAttribute('min', aujourdhui);

    demain.setDate(demain.getDate() + 1);


    dateFin.setAttribute('min', demain.toISOString().split('T')[0]);
    // Set the minimum date for the end date input based on the start date
    dateDebut.addEventListener('change', function () {
        demain = new Date(this.value);
        demain.setDate(demain.getDate() + 1);
        dateFin.value = 0;
        console.log(dateFin.value);
        dateFin.setAttribute('min', demain.toISOString().split('T')[0]);
        document.getElementById("reserverBtn").disabled = true;
        document.getElementById("prixR").innerText = 0 + "$";
    });
});