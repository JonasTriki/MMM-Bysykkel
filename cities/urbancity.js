const request = require("request");
const DirectionsAPI = require("../utils/directionsApi");

/**
 * "Abstract" object that should be created with Objects.create(...)
 *
 * Pre-condition: this.stationsInfoUrl, this.stationsStatusUrl and this.name exists and is valid.
 */
const UrbanCity = {
  create: function (name, stationsInfoUrl, stationsStatusUrl) {
    const city = Object.create(this);
    city.name = name;
    city.stationsInfoUrl = stationsInfoUrl;
    city.stationsStatusUrl = stationsStatusUrl;
    return city;
  },

  fetchData: function (config, cb) {
    const self = this;

    if (this.data) {
      this.fetchStatus(config, cb);
    } else {
      this.fetchInfo(config, function (data) {
        console.log(`Initial ${self.name} data loaded.`);

        // Set initial info data and call function again (DRY).
        self.data = data;
        self.fetchData(config, cb);
      });
    }
  },

  getHeader: function (config) {
    return { "Client-Identifier": config.clientIdentifier };
  },

  fetchInfo: function (config, cb) {
    const self = this;

    request(
      {
        url: this.stationsInfoUrl,
        method: "GET",
        headers: this.getHeader(config)
      },
      function (err, resp, body) {
        if (err) {
          console.log("FETCH_INFO_ERROR", err);
          cb(null);
          return;
        }

        // Fetch the station infos and prepare response
        data = new Object();
        const infoJson = JSON.parse(body);
        const fromStationInfo = self.findStation(
          infoJson,
          config.fromStationId
        );
        data.from = {
          name: fromStationInfo.name,
          total: fromStationInfo.capacity
        }

        if(config.toStationId !== -1) {
          const toStationInfo = self.findStation(
            infoJson,
            config.toStationId
          );
          data.to = {
            name: toStationInfo.name,
            total: toStationInfo.capacity
          }
        }

        // and call google API if we have the key.
        if (config.googleMapsApiKey !== "" && toStationInfo !== undefined) {
          DirectionsAPI.getDuration(
            fromStationInfo,
            toStationInfo,
            config.language,
            config.googleMapsApiKey,
            function (duration) {
              if (duration === null) {
                cb(data);
                return;
              }

              data.eta = duration;
              cb(data);
            }
          );
        } else {
          cb(data);
        }
      }
    );
  },

  fetchStatus: function (config, cb) {
    const self = this;

    // Pre-condition: self.data exists and has from and to props.
    request(
      {
        url: this.stationsStatusUrl,
        method: "GET",
        headers: this.getHeader(config)
      },
      function (err, resp, body) {
        if (err) {
          console.log("FETCH_INFO_ERROR", err);
          cb(null);
          return;
        }

        // ... fetched the station statuses
        const statusJson = JSON.parse(body);
        const fromStationStatus = self.findStation(
          statusJson,
          config.fromStationId
        );
        self.data.from.available = fromStationStatus.num_bikes_available;

        if (config.toStationId !== -1) {
          const toStationStatus = self.findStation(
            statusJson,
            config.toStationId
          );
          self.data.to.available = toStationStatus.num_docks_available;
        }
        
        cb(self.data);
      }
    );
  },

  findStation: function (json, stationId) {
    return json.data.stations.find(function (s) {
      return +s.station_id === +stationId;
    });
  }
};

module.exports = UrbanCity;
