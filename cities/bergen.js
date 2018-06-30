const UrbanCity = require("./urbancity");

const Bergen = {
  create: function () {
    return UrbanCity.create(
      "Bergen",
      "http://gbfs.urbansharing.com/bergen-city-bike/station_information.json",
      "http://gbfs.urbansharing.com/bergen-city-bike/station_status.json"
    );
  }
};

module.exports = Bergen;