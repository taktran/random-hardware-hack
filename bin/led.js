// Test file for a LED light
var five = require("johnny-five"),
  board, led;

board = new five.Board();

board.on("ready", function() {

  // Create a standard `led` hardware instance
  led = new five.Led({
    pin: 13
  });

  board.repl.inject({
    led: led
  });

  // "on" turns the led _on_
  led.on();
});