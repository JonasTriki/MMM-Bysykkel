const UrbanCity = require("./urbancity");

const Trondheim = {
  create: function () {
    return UrbanCity.create(
      "Trondheim",
      "http://gbfs.urbansharing.com/trondheim/station_information.json",
      "http://gbfs.urbansharing.com/trondheim/station_status.json"
    );
  }
};

module.exports = Trondheim;