async function fetchRevenues() {
  try {
    const response = await fetch('http://localhost:4000/dashboard/revenue');
    if (!response.ok) {
      throw new Error('Échec de la récupération des revenus');
    }
    const revenue = await response.json();
    console.log(revenue);
    return revenue;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function grouperRevenueParMois(revenueList) {
  const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const groupedRevenues = Array.from({ length: 12 }, () => 0);

  revenueList.forEach(revenue => {
    const month = new Date(revenue.date).getMonth();
    groupedRevenues[month] += revenue.revenue;
  });

  return mois.map((month, index) => ({
    month,
    revenue: groupedRevenues[index]
  }));
}

async function createChart(selectedYear) {
  var titre = "Revenus "
  const revenueList = await fetchRevenues();
  console.log(selectedYear);
  if (selectedYear != undefined){
    
    const RevenueAnnee = revenueList.filter(revenue => new Date(revenue.date).getFullYear() === selectedYear);
    const revenueFormatter = grouperRevenueParMois(RevenueAnnee);

    const mois = revenueFormatter.map(item => item.month);
    const revenus = revenueFormatter.map(item => item.revenue);

    new Chart("myChart", {
      type: "bar",
      data: {
        labels: mois,
        datasets: [{
          label: 'Revenues',
          backgroundColor: "rgba(171, 217, 227)",
          data: revenus
        }]
      },
      options: {
        events: [],
        legend: { display: false },
        title: {
          display: true,
          text: `${titre}(${selectedYear})`,
          fontSize: 25
        },
        scales: {
          xAxes: [{ ticks: { fontSize: 14 } }],
          yAxes: [{ ticks: { fontSize: 14 } }]
        }
      }
    });
  } else {
    document.getElementById("textPasRevenus").style.display = "block";
    document.getElementById("typeGraphique").style.display = "none";  
  }
  
}

async function InitialiserOptions() {
  const revenueList = await fetchRevenues();

  const annee = [...new Set(revenueList.map(revenue => new Date(revenue.date).getFullYear()))];
  const selectElement = document.getElementById("typeGraphique");
  annee.forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    selectElement.appendChild(option);
  });

  const defaultYear = annee[0];
  await createChart(defaultYear);
}

InitialiserOptions();

document.getElementById("typeGraphique").addEventListener("change", function () {
  const anneeSelectionner = parseInt(this.value);
  createChart(anneeSelectionner);
});
