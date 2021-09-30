mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: "show-map",
    style: "mapbox://styles/mapbox/light-v10",
    center: campground.geometry.coordinates,
    zoom: 12
})

map.addControl(new mapboxgl.NavigationControl())


const marker = new mapboxgl.Marker({
})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ofset:25})
            .setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`)
    )
    .addTo(map);