var five = require("johnny-five");
var Sensor = require("../lib/Sensor");
var helper = require("../lib/helper");

var NORMALIZED_MIN = 0;
var NORMALIZED_MAX = 1.0;

var LIGHT_SENSOR_MIN = 880;
var LIGHT_SENSOR_MAX = 1015;

var PRESSURE_SENSOR_MIN = 50;
var PRESSURE_SENSOR_MAX = 1023;


new five.Board().on("ready", function() {
  var pressureSensor = new Sensor("A1", board);

  pressureSensor.on("read", function(value) {
    var normVal = helper.inRange(value, PRESSURE_SENSOR_MIN, PRESSURE_SENSOR_MAX, NORMALIZED_MIN, NORMALIZED_MAX);

    var data = {
      pressVal: normVal
    };

    if (normVal < 0.3) {
      data.hardPress = true;
    } else {
      data.hardPress = false;
    }

    console.log(data);
  });
});