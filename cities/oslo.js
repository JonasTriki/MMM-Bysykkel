const UrbanCity = require("./urbancity");

const Oslo = {
  create: function () {
    return UrbanCity.create(
      "Oslo",
      "https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json",
      "https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json"
    );
  }
};

module.exports = Oslo;
