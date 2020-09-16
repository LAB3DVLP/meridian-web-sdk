/* global MeridianSDK */

import { fakeAPI } from "./fake-api.js";

const root = document.getElementById("meridian-map");
const meridianMap = MeridianSDK.createMap(root, {
  api: fakeAPI,
  locationID: "5198682008846336",
  floorID: "5755685136498688",
  height: "100%",
  onTagClick: tag => {
    console.log("tag", tag);
  },
  onPlacemarkClick: placemark => {
    console.log("placemark", placemark);
  }
});

Object.assign(window, { meridianMap });
