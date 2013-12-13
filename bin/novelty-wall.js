// Server to connect to hardware

'use strict';

// Timer
var GAME_TIMER_LIMIT = 10; // seconds

var SENSOR_PINS = {
  snowman: 13
}

// Amount of time to throttle before next input
var SENSOR_THROTTLE_TIME = 500;

var five = require("johnny-five");
var Primus = require('primus');
var _ = require('underscore');

var http = require('http');
var server = http.createServer();
var primus = new Primus(server, {
  transformer: 'sockjs'
});

var Sensor = require("./lib/Sensor");
var GameState = require("./lib/GameState");

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
  var connections = {};

  // --------------------------------------------
  // Hardware setup
  // --------------------------------------------

  var snowman = new five.Pin(SENSOR_PINS.snowman);

  // --------------------------------------------
  // Game setup
  // --------------------------------------------


  // --------------------------------------------
  // Real time connection
  // --------------------------------------------

  primus.on('connection', function(spark) {
    var gameState;
    console.log('connection:\t', spark.id);

    // Store connections based on spark id.
    // Retrieve it if it already exists
    if (!connections[spark.id]) {
      connections[spark.id] = {
        gameState: new GameState(spark, GAME_TIMER_LIMIT)
      }
    }
    gameState = connections[spark.id]["gameState"];

    // --------------------------------------------
    // Set up sensors
    // --------------------------------------------

    snowman.on("high", _.throttle(function() {
      if (!gameState.isGameOver()) {
        // Snow man is hit!
        gameState.incrementScore();

        var data = {
          type: "score",
          message: {
            score: gameState.score
          }
        };

        spark.write(JSON.stringify(data));
      }
    }, SENSOR_THROTTLE_TIME));


    // --------------------------------------------
    // Read data sent from browser
    // --------------------------------------------

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

    // Clear memory
    delete connections[spark.id];
  });

  console.log(' [*] Listening on 0.0.0.0:9999' );
  server.listen(9999, '0.0.0.0');

});
