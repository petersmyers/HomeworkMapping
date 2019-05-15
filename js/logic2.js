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
// function createFeatures(earthquakeData) {
// We need to get our json data
    d3.json(earth_url, function(earthquakeData) {
    // we need a marker layer that we can put onto our map
        var dot = L.layerGroup();
        // Our URL call will pull a json object, and we want just the features if that object.
        var quakes = earthquakeData.features;

        for (var e = 0; e < quakes.length; e++) {
            // the latitude/longitude data for each quake is located in the geometry part
            var whereAt = quakes[i].geometry;
            // How big was this quake?
            var howBig = records[i].properties.mag;
            // Then, if we have some useful data, let's put that data onto the map
            if (whereAt) {
            // Add a new marker to the cluster group and bind a pop-up
                if (howBig < 1){
                    mycolor = "lime"
                }
                else if (howBig < 2){
                    mycolor = "Yellow"
                }
                else if (howBig < 3) {
                    mycolor = "gold"
                }
                else if (howBig < 4) {
                    mycolor = "orange"
                }
                else {mycolor = "firebrick"}
            markers.addLayer(L.circleMarker([whereAt.coordinates[1], whereAt.coordinates[0]],
                {
                    radius: howBig*100,
                    color: mycolor
                })
            .bindPopup(props.title));
            }
  
        }
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
    }
// };
    