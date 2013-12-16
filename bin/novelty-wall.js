// Server to connect to hardware

'use strict';

// Timer
var GAME_TIMER_LIMIT = 30; // seconds

var SENSOR_PINS = {
  snowman: 13
};

var LIGHT_SENSOR_MIN = 880;
var LIGHT_SENSOR_MAX = 1015;
var LIGHTNESS_MIN = 0;
var LIGHTNESS_MAX = 1.0;
var LIGHT_ON_THRESHOLD = 0.5;

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

var helper = require("./lib/helper");
var Sensor = require("./lib/Sensor");
var GameState = require("./lib/GameState");

var board = five.Board();

board.on("ready", function() {
  var connections = {};

  // --------------------------------------------
  // Hardware setup
  // --------------------------------------------

  var snowman = new five.Pin(SENSOR_PINS.snowman);

  // Photo resister
  var photoResistor = new Sensor("A0", board);

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
      };
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


    // Send light data
    photoResistor.on("read", function(value) {
      var normVal = helper.inRange(value, LIGHT_SENSOR_MIN, LIGHT_SENSOR_MAX, LIGHTNESS_MIN, LIGHTNESS_MAX);
      var data = {
        type: "light",
        message: {
          lightVal: normVal
        }
      };

      // console.log("light:", normVal, "(", value, ")");
      if (normVal < LIGHT_ON_THRESHOLD) {
        data.message.lowLight = true;
      } else {
        data.message.lowLight = false;
      }

      spark.write(JSON.stringify(data));
    });

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
