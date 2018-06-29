# MagicMirror² Module: Bysykkel
MagicMirror² module for showing the availability of the city bikes around in Norway. It is using data from various open data sources <-- TODO.

This module is inspired by the [MMM-OsloCityBike](https://github.com/TobbenTM/MMM-OsloCityBike) module from TobbenTM.

![Screenshot](TODO) <!-- images/screenshot.png -->

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
	module: 'MMM-Bysykkel',
	header: 'Bysykkel',
	position: 'top_left',
	config: {
		TODO
	}
},
```

# Configuration options

TODO

## Translations

This modules is translated to the following languages:

Language | Responsible
---|---
en (English) | Jonas Triki
nb (Norwegian) | Jonas Triki

If you wish to contribute, please make a pull request.