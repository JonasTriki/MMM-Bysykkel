const express = require("express");
const NodeHelper = require("node_helper");
const request = require("request");
const path = require("path");

module.exports = NodeHelper.create({

	// Override start method.
	start: function() {
		console.log("Starting node helper for: " + this.name);
		this.setConfig();
		this.extraRoutes();
	},

	setConfig: function() {
    this.imgPath = path.resolve(global.root_path + "modules" + path.sep + "MMM-Bysykkel" + path.sep + "img" + path.sep) + path.sep;
	},

	extraRoutes: function() {
    const self = this;
    this.expressApp.get("/MMM-Bysykkel/images", function(req, res) {
      res.send(self.imgPath);
    });
  },
  
  getFiles: function(path) {
		return fs.readdirSync(path).filter(function (file) {
			if (! fs.statSync(path + "/" + file).isDirectory() ) {
				return file;
			}
		});
	},
});