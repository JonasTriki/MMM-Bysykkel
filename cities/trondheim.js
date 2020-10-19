const UrbanCity = require("./urbancity");

const Trondheim = {
  create: function () {
    return UrbanCity.create(
      "Trondheim",
      "https://gbfs.urbansharing.com/trondheimbysykkel.no/station_information.json",
      "https://gbfs.urbansharing.com/trondheimbysykkel.no/station_status.json"
    );
  }
};

module.exports = Trondheim;
