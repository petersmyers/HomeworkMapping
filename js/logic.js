// Lets start out with defining where we are getting the data from
// Earthquake data for past month 
// earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// JUST KIDDING! don't try to load 30 days of data. you will break your browser. fail. 

// let's try for the past 7 days
// earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// hard NOPE on that! This one loaded, but then froze all other windows that were opened in my browser. Load this URL at your own risk.

// Let's go with in the past day
earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
// We're gonna call for the data. And then we are going to send that data into a function which will do all the heavy lifting (or at least a lot of it)
d3.json(earth_url, function(data) {
    console.log(data)
  createFeatures(data.features);
});
// ****************************************************************************************
// Gotta define all the functions now!
// ****************************************************************************************

// Here's that feature function referenced above!
function createFeatures(earthquakeData) {
// We need to get our json data

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  } 

//   Define the marker specs

  function mystyle(feature){ 
    var style = {
    radius: feature.properties.mag,
    scale: ["gold", "deeppink"],
    steps: 10,
    mode: "q",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8}
    return style
  };

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    style: mystyle(feature),
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// ****************************************************************************************
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};