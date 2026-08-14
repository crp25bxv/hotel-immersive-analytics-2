// ==========================================
// HOTEL IMMERSIVE ANALYTICS PROJECT
// ==========================================


// ------------------------------------------
// 1. GET USER LOCATION
// ------------------------------------------

function getLocation() {

    if (!navigator.geolocation) {

        document.getElementById("location").innerHTML =
            "Geolocation is not supported by this browser.";

        return;
    }


    document.getElementById("location").innerHTML =
        "Getting your location...";


    navigator.geolocation.getCurrentPosition(

        showPosition,

        showError,

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}



// ------------------------------------------
// 2. SHOW USER LOCATION
// ------------------------------------------

function showPosition(position) {

    const userLat = position.coords.latitude;

    const userLng = position.coords.longitude;


    console.log("User Latitude:", userLat);

    console.log("User Longitude:", userLng);


    document.getElementById("location").innerHTML =

        "<strong>Your current location:</strong><br>" +

        "Latitude: " + userLat.toFixed(6) +

        "<br>" +

        "Longitude: " + userLng.toFixed(6);


    // Google Maps verification link

    const mapLink =
        document.getElementById("mapLink");


    mapLink.href =
        "https://www.google.com/maps?q=" +
        userLat +
        "," +
        userLng;


    mapLink.style.display = "inline-block";


    // Load hotels after location is obtained

    loadHotels(userLat, userLng);

}



// ------------------------------------------
// 3. LOCATION ERROR
// ------------------------------------------

function showError(error) {

    let message = "";

    switch (error.code) {

        case error.PERMISSION_DENIED:

            message =
                "Location permission was denied.";

            break;


        case error.POSITION_UNAVAILABLE:

            message =
                "Location information is unavailable.";

            break;


        case error.TIMEOUT:

            message =
                "The location request timed out.";

            break;


        default:

            message =
                "An unknown location error occurred.";

    }


    document.getElementById("location").innerHTML =
        message;

}



// ------------------------------------------
// 4. LOAD HOTEL JSON
// ------------------------------------------

function loadHotels(userLat, userLng) {

    fetch("hotels.json")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Could not load hotels.json"
                );

            }

            return response.json();

        })

        .then(hotels => {

            console.log("Hotels loaded:", hotels);


            // Calculate distance for every hotel

            hotels.forEach(hotel => {

                hotel.distance =
                    calculateDistance(

                        userLat,

                        userLng,

                        hotel.latitude,

                        hotel.longitude

                    );

            });


            // Sort nearest hotel first

            hotels.sort(
                (a, b) =>
                    a.distance - b.distance
            );


            // Display hotels

            displayHotels(hotels);


            // Create 3D visualisation

            create3DChart(hotels);

        })

        .catch(error => {

            console.error(error);

            document.getElementById("hotelList").innerHTML =

                "Error loading hotel data.";

        });

}



// ------------------------------------------
// 5. CALCULATE DISTANCE
// ------------------------------------------

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;


    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;


    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;


    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(lat1 * Math.PI / 180)

        *

        Math.cos(lat2 * Math.PI / 180)

        *

        Math.sin(dLon / 2)
        *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;

}



// ------------------------------------------
// 6. DISPLAY HOTELS
// ------------------------------------------

function displayHotels(hotels) {

    const container =
        document.getElementById("hotelList");


    container.innerHTML = "";


    hotels.forEach(hotel => {

        const card =
            document.createElement("div");


        card.className =
            "hotel-card";


        card.innerHTML =

            "<h3>" +
            hotel.name +
            "</h3>" +

            "<p>⭐ Rating: " +
            hotel.rating +
            "</p>" +

            "<p>💷 Price: £" +
            hotel.price +
            "</p>" +

            "<p>💬 Reviews: " +
            hotel.reviews +
            "</p>" +

            "<p>🌐 Latitude: " +
            hotel.latitude.toFixed(6) +
            "</p>" +

            "<p>🌐 Longitude: " +
            hotel.longitude.toFixed(6) +
            "</p>" +

            "<p class='distance'>" +

            "📍 Distance: " +

            hotel.distance.toFixed(2) +

            " km" +

            "</p>";


        container.appendChild(card);

    });

}



// ------------------------------------------
// 7. CREATE A-FRAME 3D BARS
// ------------------------------------------

function create3DChart(hotels) {

    const chart =
        document.getElementById("hotelChart");

    // Remove previous AR objects
    chart.innerHTML = "";

    hotels.forEach((hotel) => {

        // Create a GPS-based AR entity
        const hotelEntity =
            document.createElement("a-entity");

        // IMPORTANT:
        // Place this hotel using its latitude and longitude
        hotelEntity.setAttribute(
            "gps-new-entity-place",
            `latitude: ${hotel.latitude}; longitude: ${hotel.longitude};`
        );


        // -------------------------------
        // 3D BAR
        // -------------------------------

        const bar =
            document.createElement("a-box");

        const height =
            hotel.rating;

        bar.setAttribute(
            "position",
            `0 ${height / 2} 0`
        );

        bar.setAttribute(
            "width",
            "2"
        );

        bar.setAttribute(
            "depth",
            "2"
        );

        bar.setAttribute(
            "height",
            height
        );

        bar.setAttribute(
            "color",
            "#3498db"
        );


        // -------------------------------
        // HOTEL INFORMATION LABEL
        // -------------------------------

        const label =
            document.createElement("a-text");

        label.setAttribute(
            "value",
            `${hotel.name}\n⭐ ${hotel.rating}\n£${hotel.price}\n💬 ${hotel.reviews}`
        );

        label.setAttribute(
            "position",
            `0 ${height + 1.5} 0`
        );

        label.setAttribute(
            "align",
            "center"
        );

        label.setAttribute(
            "color",
            "#FFFFFF"
        );

        label.setAttribute(
            "width",
            "8"
        );


        // Make label face the camera
        label.setAttribute(
            "look-at",
            "[gps-new-camera]"
        );


        // Add bar and label to hotel entity
        hotelEntity.appendChild(bar);

        hotelEntity.appendChild(label);

        // Add hotel to AR scene
        chart.appendChild(hotelEntity);

    });

}