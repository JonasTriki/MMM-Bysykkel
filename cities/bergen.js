const UrbanCity = require("./urbancity");

const Bergen = {
  create: function () {
    return UrbanCity.create(
      "Bergen",
      "https://gbfs.urbansharing.com/bergenbysykkel.no/station_information.json",
      "https://gbfs.urbansharing.com/bergenbysykkel.no/station_status.json"
    );
  }
};

module.exports = Bergen;
