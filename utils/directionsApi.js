const axios = require("axios");

const directionsUrl = function (from, to, language, key) {
  return `https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lon}&destination=${to.lat},${to.lon}&mode=bicycling&language=${language}&key=${key}`;
};

const DirectionsAPI = {
  getDuration: async function (fromLoc, toLoc, language, apiKey) {
    try {
      const directionsJson = axios.get(
        directionsUrl(fromLoc, toLoc, language, apiKey)
      );

      return directionsJson.routes[0].legs[0].duration;
    } catch (err) {
      console.log("DirectionsAPI error", err);
    }
    return null;
  }
};

module.exports = DirectionsAPI;
