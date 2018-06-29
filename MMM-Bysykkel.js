Module.register("MMM-Bysykkel", {

	defaults: {
		updateInterval: 1000	// How often we would call the API's in milliseconds. (Default 10 seconds)
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

		setInterval(function() {
			self.requestData();
		}, this.config.updateInterval);
	},

	getDom: function() {
		const container = document.createElement("div");
		container.className = "container";
		if (!this.data) {

			const top = document.createElement("div");
			top.className = "top";

			const logo = document.createElement("img");
			logo.src = "img/bysykkel-bergen.svg";
			top.appendChild(logo);

			container.appendChild(top);
		} else {
			container.innerHTML = this.translate("LOADING");
		}
		return container;
	},

	requestData: function() {
		console.log(this.translate("LOADING") + ": " + this.name);

	}
});
