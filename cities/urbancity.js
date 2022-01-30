const axios = require("axios");
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

  fetchData: async function (config) {
    try {
      if (this.data) {
        await this.fetchStatus(config);
        return this.data;
      } else {
        this.data = await this.fetchInfo(config);
        console.log(`Initial ${this.name} data loaded.`);

        // Call function again with this.data set
        return this.fetchData(config);
      }
    } catch (err) {
      console.log("FETCH_DATA_ERROR", err);
    }
    return null;
  },

  getHeader: function (config) {
    return { "Client-Identifier": config.clientIdentifier };
  },

  fetchInfo: async function (config) {
    try {
      const { data: infoJson } = await axios.get(this.stationsInfoUrl, {
        headers: this.getHeader(config)
      });

      // Fetch the station infos and prepare response
      const data = new Object();
      const canGetDuration = config.googleMapsApiKey !== "";
      data.stations = await Promise.all(
        config.stations.map(async (station) => {
          const stationData = {};

          // Find from station info
          const fromStationInfo = this.findStation(infoJson, station.from);
          stationData.from = {
            name: fromStationInfo.name,
            total: fromStationInfo.capacity
          };

          // Find to station info
          if (station.to !== -1) {
            const toStationInfo = this.findStation(infoJson, station.to);
            stationData.to = {
              name: toStationInfo.name,
              total: toStationInfo.capacity
            };

            if (canGetDuration) {
              // Get duration to bike from A to B using Google
              stationData.eta = await DirectionsAPI.getDuration(
                fromStationInfo,
                toStationInfo,
                config.language,
                config.googleMapsApiKey
              );
            }
          }

          return stationData;
        })
      );

      return data;
    } catch (err) {
      console.log("FETCH_INFO_ERROR", err);
    }
    return null;
  },

  fetchStatus: async function (config) {
    // Pre-condition: this.data exists and has from and to props.
    try {
      // Fetch the station statuses
      const { data: statusJson } = await axios.get(this.stationsStatusUrl, {
        headers: this.getHeader(config)
      });

      config.stations.forEach((station, i) => {
        const fromStationStatus = this.findStation(statusJson, station.from);
        this.data.stations[i].from.available =
          fromStationStatus.num_bikes_available;

        if (station.to !== -1) {
          const toStationStatus = this.findStation(statusJson, station.to);
          this.data.stations[i].to.available =
            toStationStatus.num_docks_available;
        }
      });

      return true;
    } catch (err) {
      console.log("FETCH_INFO_ERROR", err);
    }
    return false;
  },

  findStation: function (json, stationId) {
    return json.data.stations.find(function (s) {
      return +s.station_id === +stationId;
    });
  }
};

module.exports = UrbanCity;
