const request = require("request");

const stationInfo = "http://gbfs.urbansharing.com/bergen-city-bike/station_information.json";
const stationStatus = "http://gbfs.urbansharing.com/bergen-city-bike/station_status.json";

const Bergen = {
  fetchData: function(fromStationId, toStationId, cb) {
    const self = this;

    request({url: stationInfo, method: "GET"}, function(err, resp, body) {
      if (err) {
        cb(err);
        return;
      }

      // Fetched the station infos,
      const infoJson = JSON.parse(body);
      const fromStationInfo = self.findStation(infoJson, fromStationId);
      const toStationInfo = self.findStation(infoJson, toStationId);
      request({url: stationStatus, method: "GET"}, function(err2, resp2, body2) {
        if (err2) {
          cb(err2);
          return;
        }

        // ... fetched the station statuses
      const statusJson = JSON.parse(body2);
        const fromStationStatus = self.findStation(statusJson, fromStationId);
        const toStationStatus = self.findStation(statusJson, toStationId);

        // ... and finally, prepare and send the response.
        const data = {
          from: {
            name: fromStationInfo.name,
            available: fromStationStatus.num_bikes_available,
            total: fromStationInfo.capacity
          },
          eta: 10, // TODO: call google API
          to: {
            name: toStationInfo.name,
            available: toStationStatus.num_docks_available,
            total: toStationInfo.capacity
          }
        };
        cb(data);
      });
    });
  },

  findStation: function(json, stationId) {
    return json.data.stations.find(function(s) {
      return s.station_id === stationId
    });
  }
}

module.exports = Bergen;