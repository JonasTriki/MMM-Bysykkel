# MagicMirror² Module: Bysykkel
MagicMirror² module for showing the availability of the city bikes around in Norway. It is using data from [Urban Infrastructure Partner AS](http://www.urbansharing.com/) and [Oslo Bysykkel](https://oslobysykkel.no/), licenced under the [Norwegian Licence for Open Government Data (NLOD)](https://data.norge.no/nlod/en/2.0).

This module is inspired by the [MMM-OsloCityBike](https://github.com/TobbenTM/MMM-OsloCityBike) module from TobbenTM.

![Screenshot](img/screenshot.png)

## Installation

Remote to your MM2-box with your terminal software and go to your MagicMirror's Module folder:
````bash
cd ~/MagicMirror/modules
````

Clone the repository:
````bash
git clone https://github.com/JonasTriki/MMM-Bysykkel.git
````

Go to the modules folder:
````bash
cd MMM-Bysykkel
````

Install the dependencies:
````bash
npm install
````

Add the module to the modules array in the `config/config.js` file by adding the following section. You can change this configuration later when you see this works:
```
{
	module: "MMM-Bysykkel",
	position: "middle_center",
	config: {}
},
```

# Configuration options

These are the valid configuration options you can put inside the config array above:

Configuration option | Comment | Default 
---|---|---
updateInterval | Refresh rate in MS for how often we call the API's. Don't set this too low, most of the data refreshes every 10s anyway. | 30000
osloBysykkelId | Client identifier for Oslo Bysykkel. [Click here to create new](https://developer.oslobysykkel.no/clients/new). Required if city === "oslo". | ""
googleMapsApiKey | [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) for calculating the time between the city bike stops. | Required if you want estimated time between stations
city | What city we're biking in. | "bergen"
fromStationId |  Desired starting station identifier; used to tell which station we're starting from. | 3
toStationId | Desired end station identifier; used to tell which station we're heading towards. | 5

For from/to-StationId, please visit the  the documentation of the cities for reference.

## Cities

This module supports the following cities:

City | Documentation
---|---
Oslo | [Oslo Bysykkel Developer](https://developer.oslobysykkel.no/)
Bergen | [Bergen Bysykkel API](https://bergenbysykkel.no/apne-data)
Trondheim | [Trondheim Bysykkel API](https://trondheimbysykkel.no/apne-data)

## Translations

This modules is translated to the following languages:

Language | Responsible
---|---
en (English) | Jonas Triki
nb (Norwegian) | Jonas Triki

If you wish to contribute, please make a pull request.