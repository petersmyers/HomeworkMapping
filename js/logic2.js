// Lets start out with defining where we are getting the data from
// Earthquake data for past month 
// earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// JUST KIDDING! don't try to load 30 days of data. you will break your browser. fail. 

// let's try for the past 7 days
earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// hard NOPE on that! This one loaded, but then froze all other windows that were opened in my browser. Load this URL at your own risk.

// Let's go with in the past day
// earth_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Let's first create a map, centered around the US of A *eye roll*
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// The put a littl layer on it using the beautiful leaflet shit
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

// Okay, time to get down to putting our markers on the map. fuck this was a shit show
d3.json(earth_url, function(earthquakeData) {
// we need a marker layer that we can put the markers onto our map
    var dot = L.layerGroup();
    // Our URL call will pull a json object, and we want just the features of that object.
    var quakes = earthquakeData.features;
    // There are many a feature in this dataset. We need to move through each feature and plot it
    for (var e = 0; e < quakes.length; e++) {
        // the latitude/longitude data for each quake is located in the geometry part
        var whereAt = quakes[e].geometry;
        // How big was this quake?
        var howBig = quakes[e].properties.mag;
        // Then, if we have some useful data, let's put that data onto the map
        color_ops = [ "lime", "chartreuse", "yellow", "gold", "orange", "orangered", "red", "navy"];

        // we want to make sure that the location has some useful Data. so let's check        
        if (whereAt) {
        // let's pick our frickin' colors, based on the magnitude of the quake
            if (howBig < 1){
                mycolor = color_ops[0];
            }
            else if (howBig < 2){
                mycolor = color_ops[1];
            }
            else if (howBig < 3) {
                mycolor = color_ops[2];
            }
            else if (howBig < 4) {
                mycolor = color_ops[3];
            }
            else if (howBig < 5) {
                mycolor = color_ops[4];
            }
            else if (howBig < 6) {
                mycolor = color_ops[5];
            }
            else if (howBig < 7) {
                mycolor = color_ops[6];
            }
            else {mycolor = color_ops[7];}

            // To our layer, let's add the marker to the layer
            // We want to see the actual dot, so we multiply the radius (based on the magnitude) by and integer 
            // I also don't want the outline, so I remove it with "none", but I do want to add in the fill color. And just for funs, let's make them partially see-through
            dot.addLayer(L.circleMarker([whereAt.coordinates[1], whereAt.coordinates[0]],
            {
                radius: howBig*7,
                color: "none",
                fillColor: mycolor,
                fillOpacity: .6
            })
            // AND THEN, let's add a pop up so that whenever we click on the marker, we get a little information.
            .bindPopup("<h3>" + quakes[e].properties.place +
            "</h3><p>" + new Date(quakes[e].properties.time) +
            "<br>Magnitude: " + quakes[e].properties.mag + "</p>"));
        }
    }
    // Let's make a legend. FUCK! This is the worst
    // I wonder if there was a better way to do this... probably?
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'infoLegend');
        labels = ['<strong>Magnitude</strong>'],
        categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7+"];
        // For each category level, we want to add some pretty colors (i.e. a legend)
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i class="square" style="background:' + color_ops[i] + '"></i> ' +
                (categories[i] ? categories[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };      
legend.addTo(myMap);
myMap.addLayer(dot);
});

    