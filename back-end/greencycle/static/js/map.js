// map
if ($("#map")) {
  let map;

  async function initMap() {
    let marker;
    // The location of Uluru
    let latlng;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Use these coordinates to create the marker and center the map
      },
      (error) => {
        // Handle error (e.g., user denied permission)
        console.error("Error getting user location:", error);
      }
    );
    if (
      $("#select-location").length > 0 ||
      $("#serviceAcceptConfirmed").length > 0
    ) {
      latlng = { lat: 35.5446077, lng: 6.1596945 };
    } else {
      latlng = { lat: 35.5484116, lng: 6.1698271 };
    }

    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
      zoom: 16,
      center: latlng,
      mapId: "DEMO_MAP_ID",
    });

    // The marker, positioned at Uluru
    if (latlng) {
      marker = new AdvancedMarkerElement({
        map: map,
        position: latlng,
        title: "Your Location",
      });
    }

    map.addListener("click", (event) => {
      let newLat = event.latLng.lat();
      let newLng = event.latLng.lng();
      // Move the existing marker to the clicked point
      if (marker) {
        // marker.setPosition(newLat, newLng);
        marker.setMap(null);
      }
      marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: newLat, lng: newLng },
        title: "",
      });
      $("#select-location").modal("hide");
      $("#location").val(`${newLat} - ${newLng}`);
    });
  }
  initMap();
}
