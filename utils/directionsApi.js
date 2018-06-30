const request = require("request");

const directionsUrl = function(from, to, language, key) {
  //         Bergen/Trondheim   ||    Oslo
  const fromLat = from.lat || from.center.latitude;
  const fromLng = from.lon || from.center.longitude;
  const toLat = to.lat || to.center.latitude;
  const toLng = to.lon || to.center.longitude;
  return `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&mode=bicycling&language=${language}&key=${key}`;
};

const DirectionsAPI = {
  getDuration: function(fromLoc, toLoc, language, apiKey, cb) {
    request({url: directionsUrl(fromLoc, toLoc, language, apiKey), method: "GET"}, function(err, resp, body) {
      if (err) {
        console.log("DirectionsAPI error", err);
        cb(null);
        return;
      }

      cb(JSON.parse(body).routes[0].legs[0].duration); // {text, value}
    });
  }
}

module.exports = DirectionsAPI;