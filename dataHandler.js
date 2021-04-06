'use strict';

const request = require('request');
const csv = require("csvtojson");
const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKk0_a1zf3YXbPHCKN7DLupzCbE1IdcixXP-eFVBUHUlHg-X23DONOXXFJm56tALNnW9m3bmc1H1fR/pub?gid=0&single=true&output=csv";

// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
}


/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeData = function () {
  csv({checkType: true})
    .fromStream(request.get(csvURL))
    .then((jsonObj) => {
      this.data = jsonObj;
    });
};

module.exports = Data;



