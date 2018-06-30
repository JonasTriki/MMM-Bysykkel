const express = require("express");
const NodeHelper = require("node_helper");
const path = require("path");

const cityOslo = require("./cities/oslo");
const cityBergen = require("./cities/bergen").create(); // Important to call create!
const cityTrondheim = require("./cities/trondheim").create();

module.exports = NodeHelper.create({

	// Override start method.
	start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "FETCH_DATA") {
      this.fetchData(payload); 
    }
  },

  fetchData: function(config) {
    const self = this;
    const city = this.getCity(config.city);
    if (city === null) {
      this.sendSocketNotification("CITY_ERROR", "Could not find city!");
      return;
    }

    city.fetchData(config, function(data) {
      self.sendSocketNotification("DATA_FETCHED", data);
    });
  },

  getCity: function(city) {
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