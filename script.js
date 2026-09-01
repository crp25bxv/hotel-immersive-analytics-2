let hotels = [];
let userLatitude = null;
let userLongitude = null;

// Load hotel data when the page starts
async function loadHotels() {
    try {
        const response = await fetch("hotels.json");
        hotels = await response.json();

        displayHotels();
        createBars();

    } catch (error) {
        console.error("Error loading hotels:", error);
    }
}


// Get user's location
document.getElementById("locationBtn").addEventListener("click", getLocation);

function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


// Successfully obtained location
function showPosition(position) {

    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    document.getElementById("latitude").textContent =
        userLatitude.toFixed(6);

    document.getElementById("longitude").textContent =
        userLongitude.toFixed(6);

    // Calculate distances after location is received
    hotels.forEach(hotel => {

        hotel.distance = calculateDistance(
            userLatitude,
            userLongitude,
            hotel.latitude,
            hotel.longitude
        );

    });

    // Sort nearest hotels first
    hotels.sort((a, b) => a.distance - b.distance);

    displayHotels();
}


// Handle location errors
function showError(error) {

    let message;

    switch (error.code) {

        case error.PERMISSION_DENIED:
            message = "Location permission was denied.";
            break;

        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;

        case error.TIMEOUT:
            message = "Location request timed out.";
            break;

        default:
            message = "An unknown location error occurred.";
    }

    alert(message);
}


// Calculate geographical distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}


function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


// Display hotel information cards
function displayHotels() {

    const hotelList = document.getElementById("hotelList");

    hotelList.innerHTML = "";

    hotels.forEach(hotel => {

        const hotelCard = document.createElement("div");

        hotelCard.className = "hotel-card";

        hotelCard.innerHTML = `
            <h3>${hotel.name}</h3>

            <p><strong>Rating:</strong> ${hotel.rating} ⭐</p>

            <p><strong>Price:</strong> £${hotel.price}</p>

            <p><strong>Reviews:</strong> ${hotel.reviews}</p>

            <p><strong>Latitude:</strong> ${hotel.latitude}</p>

            <p><strong>Longitude:</strong> ${hotel.longitude}</p>

            <p>
                <strong>Distance:</strong>
                ${hotel.distance
                    ? hotel.distance.toFixed(2) + " km"
                    : "Location not detected"}
            </p>
        `;

        hotelList.appendChild(hotelCard);

    });
}


// Create 3D rating bars
function createBars() {

    const container =
        document.getElementById("barContainer");

    hotels.forEach((hotel, index) => {

        // Height based on hotel rating
        const height = hotel.rating * 1.5;

        // Create a box
        const bar = document.createElement("a-box");

        // Position bars next to each other
        const xPosition = (index - 1) * 3;

        bar.setAttribute(
            "position",
            `${xPosition} ${height / 2} 0`
        );

        bar.setAttribute(
            "width",
            "1.5"
        );

        bar.setAttribute(
            "depth",
            "1.5"
        );

        bar.setAttribute(
            "height",
            height
        );

        // Different colours for each bar
        const colours = [
            "#2563eb",
            "#16a34a",
            "#f97316"
        ];

        bar.setAttribute(
            "color",
            colours[index]
        );

        container.appendChild(bar);


        // Hotel name label
        const hotelName =
            document.createElement("a-text");

        hotelName.setAttribute(
            "value",
            `${hotel.name}\nRating: ${hotel.rating}`
        );

        hotelName.setAttribute(
            "position",
            `${xPosition} ${height + 0.7} 0`
        );

        hotelName.setAttribute(
            "align",
            "center"
        );

        hotelName.setAttribute(
            "color",
            "#111"
        );

        hotelName.setAttribute(
            "width",
            "4"
        );

        hotelName.setAttribute(
            "side",
            "double"
        );

        container.appendChild(hotelName);

    });

}


// Start application
loadHotels();
