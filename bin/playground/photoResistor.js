var five = require("johnny-five");
var Sensor = require("../lib/Sensor");

var LIGHT_SENSOR_MIN = 880;
var LIGHT_SENSOR_MAX = 1015;
var LIGHTNESS_MIN = 0;
var LIGHTNESS_MAX = 1.0;
var LIGHT_ON_THRESHOLD = 0.5;

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

new five.Board().on("ready", function() {
  var photoResistor = new Sensor("A0", board);

  photoResistor.on("read", function(value) {
    var opacityVal = inRange(value, LIGHT_SENSOR_MIN, LIGHT_SENSOR_MAX, LIGHTNESS_MIN, LIGHTNESS_MAX);

    // console.log("light:", opacityVal, "(", value, ")");
    if (opacityVal > LIGHT_ON_THRESHOLD) {
      console.log("Light on!");
    }
  });
});