const adresse = document.getElementById("geocode").value;
function initMap() {
  const geocoder = new google.maps.Geocoder();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 40.7413549, lng: -73.9980244 },
  });

  const streetViewDiv = document.getElementById("street-view");
  const streetViewService = new google.maps.StreetViewService();
  const panoramaOptions = {
    pov: { heading: 270, pitch: 0 },
    zoom: 1,
  };
  const panorama = new google.maps.StreetViewPanorama(streetViewDiv, panoramaOptions);


  geocoder.geocode({ address: adresse }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      map.setCenter(location);
      panorama.setPosition(location);
    } else {
      console.error("Geocode was not successful for the following reason: " + status);
    }
  });
}
window.initMap = initMap;