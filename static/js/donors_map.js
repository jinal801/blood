$(document).ready(function(){
        $.ajax({
            url: "/blood_request_value/donors/",
            method: 'GET',
            success: function (data) {
                console.log(data);
                initMap(data);
            }
      });
    });
function initMap(data) {

mapboxgl.accessToken = 'pk.eyJ1IjoiYWRtaW5qaW5sIiwiYSI6ImNsbGtwN3huYjFoeWozZnJydHc3Z2YybDkifQ.AmBzR4SrxpuiEfSTaAqOgA';

const map = new mapboxgl.Map({
container: 'map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12',
center: data.available_donors_points[0].geometry.coordinates,
zoom: 10
});
// Create a marker and add it to the map.
for(var j=0; j<data.available_donors_points.length; j++){
console.log(data.available_donors_points.length);
new mapboxgl.Marker({color: '#F84C4C'}).setLngLat(data.available_donors_points[j].geometry.coordinates).addTo(map);

}
}