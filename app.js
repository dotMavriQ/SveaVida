var map = L.map('map').setView([39.3999, -8.2245], 7); // Centers the map on Portugal

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var markers = {}; // Object to hold markers

function addMarker(place) {
    var iconUrl = '';
    if (place.Products.includes('Grädde')) {
        iconUrl = 'gradde.png';
    } else if (place.Products.includes('Snus')) {
        iconUrl = 'snus.png';
    } else if (place.Products.includes('Svenska varor')) {
        iconUrl = 'svenskavaror.png';
    }

    if (iconUrl) { // Ensure iconUrl is not empty
        var customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35]
        });

        var marker = L.marker([place.Lat, place.Long], {icon: customIcon}).bindPopup(`<strong>${place.Placename}</strong><br>Products: ${place.Products.join(", ")}<br><a href="${place.Link}" target="_blank">More info</a>`);
        markers[place.Placename] = marker; // Store marker
    }
}

// Initially, do not add markers to map
fetch('places.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(place => {
            addMarker(place); // Just create markers, do not add to map yet
        });
    });

document.getElementById('productForm').addEventListener('change', function(e) {
    var product = e.target.name.toLowerCase();
    fetch('places.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(place => {
                if (place.Products.map(p => p.toLowerCase()).includes(product)) {
                    if (e.target.checked && !map.hasLayer(markers[place.Placename])) {
                        markers[place.Placename].addTo(map);
                    } else if (!e.target.checked && map.hasLayer(markers[place.Placename])) {
                        map.removeLayer(markers[place.Placename]);
                    }
                }
            });
        });
});
