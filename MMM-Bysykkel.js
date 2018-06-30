

Module.register("MMM-Bysykkel", {

	defaults: {
		updateInterval: 15000,	// How often we would call the API's in milliseconds. (Default 15 seconds)
		city: "bergen", // What city we're looking in.
		fromStationId: 34, // Desired starting station identifier; used to tell which station we're starting from.
		toStationId: 212 // Desired end station identifier; used to tell which station we're heading towards.
	},

	getStyles: function () {
		return ["style.css"];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
			nb: "translations/nb.json"
		}
	},

	start: function() {

		// Request data every {updateInterval} ms.
		const self = this;
		this.requestData();

		this.timer = setInterval(function() {
			self.requestData();
		}, this.config.updateInterval);
	},

	getDom: function() {
		const wrapper = document.createElement("div");
		wrapper.className = "wrapper";

		if (this.fetchedData) {

			// Top section w/logo
			const top = document.createElement("div");
			top.className = "top";

			const logo = document.createElement("img");
			logo.src = this.getImage("bysykkel-bergen"); // TODO: Make it choose the correct img
			top.appendChild(logo);

			wrapper.appendChild(top);

			// Bottom section with from, eta and to
			const bottom = document.createElement("div");
			bottom.className = "bottom";

			const from = this.createInfoSection(
				"bike",
				this.fetchedData.from.available,
				this.fetchedData.from.total,
				this.fetchedData.from.name
			);
			const eta = this.createEtaSection(this.formatTime(this.fetchedData.eta));
			const to = this.createInfoSection(
				"lock-open",
				this.fetchedData.to.available,
				this.fetchedData.to.total,
				this.fetchedData.to.name
			);

			bottom.appendChild(from);
			bottom.appendChild(eta);
			bottom.appendChild(to);
			wrapper.appendChild(bottom);
		} else {
			wrapper.innerHTML = this.translate("LOADING");
		}
		return wrapper;
	},

	createInfoSection: function(iconName, m, n, name) {
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

		const bottom = document.createElement("div");
		bottom.innerHTML = name;

		section.appendChild(top);
		section.appendChild(bottom);
		return section;
	},

	createEtaSection: function(text) {
		const section = document.createElement("div");
		section.className = "section";

		const top = document.createElement("div");
		const img = document.createElement("img");
		img.src = this.getImage("nav-dots");
		top.appendChild(img);

		const bottom = document.createElement("div");
		bottom.innerHTML = text;

		section.appendChild(top);
		section.appendChild(bottom);
		return section;
	},

	getImage: function(name) {
		return "/modules/MMM-Bysykkel/img/" + name + ".svg";
	},

	formatTime: function(time) {
		return "~" + time + " min"; // TODO: actual formatting. time = seconds.
	},

	requestData: function() {
		console.log(this.translate("LOADING") + ": " + this.name);
		const self = this;

		this.queryData(this.config.city, this.config.fromStationId, this.config.toStationId);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "DATA_FETCHED") {
			this.fetchedData = payload;
			this.updateDom();
		} else if (notification === "CITY_ERROR") {
			clearInterval(this.timer);
			console.log(this.translate("CITY_ERROR"));
		}
	},

	queryData: function(city, from, to) {
		this.sendSocketNotification("FETCH_DATA", {
			city: city,
			from: from,
			to: to
		});
	}
});
