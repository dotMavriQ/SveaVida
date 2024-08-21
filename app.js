var map = L.map('map').setView([39.3999, -8.2245], 7); // Centers the map on Portugal

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to add markers
var markers = {};

function addMarker(place) {
    var marker = L.marker([place.Lat, place.Long]).addTo(map)
        .bindPopup(`<strong>${place.Placename}</strong><br>Products: ${place.Products.join(", ")}<br><a href="${place.Link}" target="_blank">More info</a>`);
    markers[place.Placename] = marker;
}

function removeMarker(place) {
    map.removeLayer(markers[place.Placename]);
    delete markers[place.Placename];
}

// Load places data
fetch('places.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(place => {
            addMarker(place);
        });
    });

// Handle checkbox changes
document.getElementById('productForm').addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        fetch('places.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(place => {
                    if (place.Products.includes(e.target.name)) {
                        if (e.target.checked) {
                            addMarker(place);
                        } else {
                            removeMarker(place);
                        }
                    }
                });
            });
    }
});
