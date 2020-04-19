var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data){

    createfeatures(data.features)
});
 function createfeatures(earthquakeData){
     function getRadius(magnitude){
         
        return magnitude*4;

     }
     function getColor(magnitude){

        switch(true){
            case magnitude > 5:
                return "red";
            case magnitude > 4:
                return "blue";
            case magnitude > 3:
                return "green";
            case magnitude > 2:
                return "purple";
            case magnitude > 1:
                return "orange";
            default:
                return "yellow";
        }
     }
     function styleInfo(features){
        return {

            radius: getRadius(features.properties.mag),
            fillColor: getColor(features.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
     }
     function onEachFeature(feature,layer){
         layer.bindPopup(feature.properties.place, feature.properties.time, feature.properties.mag);
     }
     var earthquake = L.geoJson(earthquakeData, {
         pointToLayer: function(feature, latlng){
             return L.circleMarker(latlng);
         },
         onEachFeature:onEachFeature,
         style: styleInfo
     });
     createMap(earthquake);
 }
 function createMap(earthquake){

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_key
      });
    
      // Create a baseMaps object to hold the lightmap layer
      var baseMaps = {
        "Light Map": lightmap
      };
    
      // Create an overlayMaps object to hold the earthQuake layer
      var overlayMaps = {
        "EarthQuakes": earthquake
      };
    
      // Create the map object with options
      var map = L.map("map", {
        center: [37.00, -95.00],
        zoom: 5,
        layers: [lightmap, earthquake]
      });
    
      // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
      }).addTo(map);
 }