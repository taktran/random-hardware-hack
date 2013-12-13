// Server to connect to hardware

'use strict';

var NORMALIZED_MIN = 0,
    NORMALIZED_MAX = 1.0,

    LIGHT_SENSOR_MIN = 880,
    LIGHT_SENSOR_MAX = 1015,

    PRESSURE_SENSOR_MIN = 50,
    PRESSURE_SENSOR_MAX = 1023;

var five = require("johnny-five");
var Sensor = require("./lib/Sensor");

function inRange(value, valueMin, valueMax, rangeMin, rangeMax) {
  var valueProportion = Math.abs(value - valueMin) / (valueMax - valueMin),
    valueMap = (
      (valueProportion * (rangeMax - rangeMin)) + rangeMin
    );

  if (valueMap >= rangeMax) {
    valueMap = rangeMax;
  }

  if (valueMap <= rangeMin) {
    valueMap = rangeMin;
  }

  return valueMap;
}

var board = five.Board();

board.on("ready", function() {

  // --------------------------------------------
  // Hardware setup
  // --------------------------------------------

  // // Light
  // var rgb = new five.Led.RGB([ 9, 10, 11 ]);

  // // Photo resister
  // var photoResistor = new Sensor("A3", board);

  // // Pressure sensor
  // var pressureSensor = new Sensor("A4", board);

  // --------------------------------------------
  // Real time connection
  // --------------------------------------------

  var Primus = require('primus'),
      http = require('http');

  var server = http.createServer(),
    primus = new Primus(server, {
      transformer: 'sockjs'
    });

  primus.on('connection', function(spark) {
    console.log('connection:\t', spark.id);

    spark.on('data', function(data) {
      console.log(data);

      // rgb.color(data);
    });
  });

  primus.on('disconnection', function(spark) {
    console.log('disconnection:\t', spark.id);
  });

  console.log(' [*] Listening on 0.0.0.0:9999' );
  server.listen(9999, '0.0.0.0');

});
