Module.register("MMM-Bysykkel", {
  defaults: {
    updateInterval: 60000, // How often we would call the API's in milliseconds. (Default 60 seconds)
    clientIdentifier: "magicmirror-module-bysykkel", // Client identifier for the module. (Default "magicmirror-module-bysykkel")
    googleMapsApiKey: "", // Google Maps API Key for calculating the time between the city bike stops. (Default empty string)
    city: "bergen", // What city we're biking in. (Default "bergen")
    stations: [{ from: 3, to: 5 }], // List of desited stations with their respective starting and end identifiers. The stations are shown in order.
    displaySingleStationName: false, // Whether to display the station name if only from station is specified.
    showLogo: true // Whether to display the Bysykkel-logo
  },

  getStyles: function () {
    return [this.file("style.css")];
  },

  getTranslations: function () {
    return {
      en: "translations/en.json",
      nb: "translations/nb.json"
    };
  },

  start: function () {
    // Request data every {updateInterval} ms.
    const self = this;
    this.requestData();

    this.timer = setInterval(function () {
      self.requestData();
    }, this.config.updateInterval);
  },

  addTopLogo: function (wrapper) {
    if (!this.config.showLogo) return;
    const top = document.createElement("div");
    top.className = "top";
    const logo = document.createElement("img");
    logo.src = this.getImage("bysykkel");
    top.appendChild(logo);
    wrapper.appendChild(top);
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    if (this.fetchedData) {
      this.addTopLogo(wrapper);
      this.fetchedData.stations.forEach((station) => {
        if (station.to) {
          this.addFromToRow(station, wrapper);
        } else {
          this.addSingleStationRow(station, wrapper);
        }
      });
    } else {
      wrapper.innerHTML = this.translate("LOADING");
    }
    return wrapper;
  },
  addFromToRow: function (station, wrapper) {
    // Bottom section with from, eta and to
    const bottom = document.createElement("div");
    bottom.className = "bottom";

    const from = this.createInfoSection(
      "bike",
      station.from.available,
      station.from.total,
      station.from.name
    );
    const eta = this.createEtaSection(station.eta);
    if (station.to) {
      var to = this.createInfoSection(
        "lock-open",
        station.to.available,
        station.to.total,
        station.to.name
      );
    }

    bottom.appendChild(from);
    bottom.appendChild(eta);
    bottom.appendChild(to);
    wrapper.appendChild(bottom);
  },

  addSingleStationRow: function (station, wrapper) {
    // Bottom section with from, eta and to
    const bottom = document.createElement("div");
    bottom.className = "bottom singleStation";

    const from = this.createInfoSection(
      "bike",
      station.from.available,
      station.from.total,
      this.config.displaySingleStationName ? station.from.name : null
    );

    bottom.appendChild(from);
    wrapper.appendChild(bottom);
  },

  createInfoSection: function (iconName, m, n, name) {
    const section = document.createElement("div");
    section.className = "section";

    const top = document.createElement("div");
    const icon = document.createElement("div");
    const img = document.createElement("img");
    img.src = this.getImage(iconName);
    icon.appendChild(img);
    top.appendChild(icon);

    const mOfN = document.createElement("div");
    const span = document.createElement("span");
    span.className = "big";
    span.innerHTML = m;
    mOfN.className = "bold";
    mOfN.appendChild(span);
    mOfN.innerHTML += "/" + n;
    top.appendChild(mOfN);

    section.appendChild(top);

    if (name) {
      const bottom = document.createElement("div");
      bottom.innerHTML = name;
      section.appendChild(bottom);
    }
    return section;
  },

  createEtaSection: function (eta) {
    const section = document.createElement("div");
    section.className = "section";

    const top = document.createElement("div");
    const img = document.createElement("img");
    img.src = this.getImage("nav-dots");
    top.appendChild(img);
    section.appendChild(top);

    // Check if we have an eta. (JSON object w/ text and value)
    if (eta) {
      const bottom = document.createElement("div");
      bottom.innerHTML = "~" + eta.text;
      section.appendChild(bottom);
    }
    return section;
  },

  getImage: function (name) {
    return (
      "/modules/MMM-Bysykkel/img/" + this.config.city + "-" + name + ".svg"
    );
  },

  requestData: function () {
    console.log(this.translate("LOADING") + ": " + this.name);
    this.sendSocketNotification("FETCH_DATA", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "DATA_FETCHED") {
      this.fetchedData = payload;
      this.updateDom();
    } else if (notification === "CITY_ERROR") {
      clearInterval(this.timer);
      console.log(this.translate("CITY_ERROR"));
    }
  }
});
