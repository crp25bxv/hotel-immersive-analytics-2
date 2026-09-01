function create3DChart(hotels) {

    const chart = document.getElementById("hotelChart");
    chart.innerHTML = "";

    hotels.forEach((hotel) => {

        const hotelEntity = document.createElement("a-entity");

        hotelEntity.setAttribute(
            "gps-entity-place",
            `latitude: ${hotel.latitude}; longitude: ${hotel.longitude};`
        );

        const bar = document.createElement("a-box");
        const height = hotel.rating;

        bar.setAttribute("position", `0 ${height / 2} 0`);
        bar.setAttribute("width", "2");
        bar.setAttribute("depth", "2");
        bar.setAttribute("height", height);
        bar.setAttribute("color", "#3498db");

        const label = document.createElement("a-text");
        label.setAttribute("value", `${hotel.name}\n⭐ ${hotel.rating}\n£${hotel.price}\n💬 ${hotel.reviews}`);
        label.setAttribute("position", `0 ${height + 1.5} 0`);
        label.setAttribute("align", "center");
        label.setAttribute("color", "#FFFFFF");
        label.setAttribute("width", "8");
        label.setAttribute("look-at", "[gps-new-camera]");

        hotelEntity.appendChild(bar);
        hotelEntity.appendChild(label);

        chart.appendChild(hotelEntity);
    });
}
