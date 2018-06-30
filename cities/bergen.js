const request = require("request");
const DirectionsAPI = require("../utils/directionsApi");

const stationsInfoUrl = "http://gbfs.urbansharing.com/bergen-city-bike/station_information.json";
const stationsStatusUrl = "http://gbfs.urbansharing.com/bergen-city-bike/station_status.json";

const Bergen = {
  fetchData: function(config, cb) {
    const self = this;

    if (this.data) {
      this.fetchStatus(config, cb);
    } else {
      this.fetchInfo(config, function(data) {
        console.log("Initial Bergen data loaded.");

        // Set initial info data and call function again (DRY).
        self.data = data;
        self.fetchData(config, cb);
      });
    }
  },

  fetchInfo: function(config, cb) {
    const self = this;

    request({url: stationsInfoUrl, method: "GET"}, function(err, resp, body) {
      if (err) {
        console.log("FETCH_INFO_ERROR", err);
        cb(null);
        return;
      }

      // Fetched the station infos,
      const infoJson = JSON.parse(body);
      const fromStationInfo = self.findStation(infoJson, config.fromStationId);
      const toStationInfo = self.findStation(infoJson, config.toStationId);

      // ... prepare the response
      const data = {
        from: {
          name: fromStationInfo.name,
          total: fromStationInfo.capacity
        },
        to: {
          name: toStationInfo.name,
          total: toStationInfo.capacity
        }
      };

      // and call google API if we have the key.
      if (config.googleMapsApiKey !== "") {
        DirectionsAPI.getDuration(fromStationInfo, toStationInfo, config.language, config.googleMapsApiKey, function(duration) {
          if (duration === null) {
            cb(data);
            return;
          }

          data.eta = duration;
          cb(data);
        });
      } else {
        cb(data);
      }
    });
  },

  fetchStatus: function(config, cb) {
    const self = this;

    // Pre-condition: self.data exists and has from and to props.
    request({url: stationsStatusUrl, method: "GET"}, function(err, resp, body) {
      if (err) {
        console.log("FETCH_INFO_ERROR", err);
        cb(null);
        return;
      }

      // ... fetched the station statuses
      const statusJson = JSON.parse(body);
      const fromStationStatus = self.findStation(statusJson, config.fromStationId);
      const toStationStatus = self.findStation(statusJson, config.toStationId);

      self.data.from.available = fromStationStatus.num_bikes_available;
      self.data.to.available = toStationStatus.num_docks_available;
      cb(self.data);
    });
  },

  findStation: function(json, stationId) {
    return json.data.stations.find(function(s) {
      return s.station_id === stationId
    });
  }
}

module.exports = Bergen;