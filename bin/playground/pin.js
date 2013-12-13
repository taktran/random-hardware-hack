var five = require("johnny-five");

new five.Board().on("ready", function() {
  var pin = new five.Pin(13);

  // Event tests
  ["high", "low"].forEach(function(type) {
    pin.on(type, function() {
      console.log("Circuit Event: ", type);
    });
  });
});