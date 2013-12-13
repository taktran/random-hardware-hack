// Microphone helper object
//
// Events:
//
//    `read`: when new values are read from the sensor
//
// Usage:
//
//    // For Microphone connected to the "A0" pin
//    var pot = new Microphone("A0");
//    pot.on("read", function(value) {
//      console.log("A0 value: " + value);
//    });
//
(function() {
  "use strict";

  var five = require("johnny-five"),
    EventEmitter = require('events').EventEmitter;

  var Microphone = function(sensorPin, board) {
    var self = this;

    self.val = 0;
    self.prev = 0;

    self.sensor = new five.Sensor({
      pin: sensorPin,
      freq: 250
    });

    self.sensor.on("read", function( err, value ) {
      self.val = value;

      self.emit("read", self.val);
      self.prev = self.val;
    });

    // Inject the `sensor` hardware into
    // the Repl instance's context.
    // Allows direct command line access
    board.repl.inject({
      mic: this.sensor
    });
  };

  Microphone.prototype.toString = function() {
    return this.val;
  };

  // Inherit EventEmitter, so it can listen/register events
  Microphone.prototype.__proto__ = EventEmitter.prototype;

  module.exports = Microphone;
})();