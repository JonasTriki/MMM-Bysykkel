const express = require("express");
const NodeHelper = require("node_helper");
const path = require("path");

const cityBergen = require("./cities/bergen");
const cityOslo = require("./cities/oslo");
const cityTrondheim = require("./cities/trondheim");

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

  fetchData: function(payload) {
    const self = this;
    const city = this.getCity(payload.city);
    if (city === null) {
      this.sendSocketNotification("CITY_ERROR", "Could not find city!");
      return;
    }

    city.fetchData(payload.from, payload.to, function(data) {
      self.sendSocketNotification("DATA_FETCHED", data);
    });
  },

  getCity: function(city) {
    switch (city) {
      case "bergen":
        return cityBergen;
      case "oslo":
        return cityOslo;
      case "trondheim":
        return cityTrondheim;
      default:
        return null;
    }
  }
});