var map = L.map('map').setView([39.3999, -8.2245], 7); // Centers the map on Portugal

// Grayscale layer for the whole world
var grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// GeoJSON data for Portugal border
var portugalBorder = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-9.294024294082845, 36.7472710948788],
            [-7.202243352977746, 36.8122056944769],
            [-7.45230633834521, 37.55964862005044],
            [-6.899397518349758, 38.07573050232611],
            [-6.925345147129605, 39.06505025549865],
            [-6.126969031558218, 41.608586064367984],
            [-6.5122506328414715, 42.054293420642836],
            [-9.182761709795727, 42.25696617476794],
            [-10.490522740966469, 38.47554775384995],
            [-9.30850585385889, 36.78329083735892],
            [-9.294024294082845, 36.7472710948788] // Closing the polygon
        ]]
    }
};

// Add GeoJSON layer for the Portugal border
var portugalArea = L.geoJSON(portugalBorder, {
    style: {
        color: "blue", // Border color
        fillColor: "rgba(255, 255, 255, 0.5)", // Fill color
        fillOpacity: 0.5,
        weight: 1
    }
}).addTo(map);

// Function to add markers
var markers = {};

function addMarker(place) {
    var marker = L.marker([place.Lat, place.Long]).addTo(map)
        .bindPopup(`<strong>${place.Placename}</strong><br>Products: ${place.Products.join(", ")}<br><a href="${place.Link}" target="_blank">More info</a>`);
    markers[place.Placename] = marker;
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
