const NodeHelper = require("node_helper");
const cityOslo = require("./cities/oslo").create(); // Important to call create!
const cityBergen = require("./cities/bergen").create();
const cityTrondheim = require("./cities/trondheim").create();

module.exports = NodeHelper.create({
  // Override start method.
  start: function () {
    console.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "FETCH_DATA") {
      this.fetchData(payload);
    }
  },

  fetchData: async function (config) {
    const city = this.getCity(config.city);
    if (city === null) {
      this.sendSocketNotification("CITY_ERROR", "Could not find city!");
      return;
    }

    try {
      const fetchedData = await city.fetchData(config);
      if (fetchedData) {
        this.sendSocketNotification("DATA_FETCHED", fetchedData);
      }
    } catch (err) {
      this.sendSocketNotification(
        "CITY_ERROR",
        "Could not fetch data for city: " + err
      );
    }
  },

  getCity: function (city) {
    switch (city) {
      case "oslo":
        return cityOslo;
      case "bergen":
        return cityBergen;
      case "trondheim":
        return cityTrondheim;
      default:
        return null;
    }
  }
});
