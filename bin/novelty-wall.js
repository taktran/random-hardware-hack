// Server to connect to hardware

'use strict';

// Timer
var GAME_TIMER_LIMIT = 10; // seconds

var SENSOR_PINS = {
  snowman: 13
}

var five = require("johnny-five");
var Primus = require('primus');

var http = require('http');
var server = http.createServer();
var primus = new Primus(server, {
  transformer: 'sockjs'
});

var Sensor = require("./lib/Sensor");
var Timer = require("./lib/Timer");

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
  var gameState;

  // --------------------------------------------
  // Hardware setup
  // --------------------------------------------

  var snowman = new five.Pin(SENSOR_PINS.snowman);

  snowman.on("high", function() {
    // Snow man is hit!
  });

  // --------------------------------------------
  // Game setup
  // --------------------------------------------

  var timer;
  gameState = {
    score: 0,
    init: function(spark) {
      var self = this;

      self.score = 0;
      if (timer) {
        timer.stop();
      }

      var data = {
        type: "info",
        message: {
          timeLimit: GAME_TIMER_LIMIT,
          score: self.score
        }
      };

      spark.write(JSON.stringify(data));
    },

    start: function(spark) {
      timer = new Timer(GAME_TIMER_LIMIT, function(currentTime) {
        var timeLeft = GAME_TIMER_LIMIT - parseInt(currentTime, 10);
        var data = {
          type: "timer",
          message: {
            timeLeft: timeLeft,
            currentTime: currentTime
          }
        };

        spark.write(JSON.stringify(data));
      });

      timer.start();
    },

    restart: function(spark) {
      timer.stop();
    }
  };

  // --------------------------------------------
  // Real time connection
  // --------------------------------------------

  primus.on('connection', function(spark) {
    console.log('connection:\t', spark.id);

    spark.on('data', function(data) {
      var messageType = data["type"];
      var message = data["message"];

      console.log(data);

      if (messageType === "gameState") {
        if (message === "init") {
          gameState.init(spark);
        } else if (message === "start") {
          gameState.start(spark);
        } else if (message === "restart") {
          gameState.restart(spark);
        }
      }
    });
  });

  primus.on('disconnection', function(spark) {
    console.log('disconnection:\t', spark.id);
  });

  console.log(' [*] Listening on 0.0.0.0:9999' );
  server.listen(9999, '0.0.0.0');

});
