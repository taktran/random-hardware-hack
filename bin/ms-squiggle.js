// Server to connect to hardware

'use strict';

// Timer
var GAME_TIMER_LIMIT = 30; // seconds

var SENSOR_PINS = {
  photoResistor: "A3"
};

var LIGHT_SENSOR_MIN = 150;
var LIGHT_SENSOR_MAX = 600;
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

  sensor_creator("lightSensor", "A1", 100, "change", light_sensor_callback);
  sensor_creator("flexSensor", "A2", 100, "change", flex_sensor_callback);
  sensor_creator("pressureSensor", "A0", 100, "change", pressure_sensor_callback);

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


    // Send light data
    photoResistor.on("read", function(value) {
      var normVal = helper.inRange(value, LIGHT_SENSOR_MIN, LIGHT_SENSOR_MAX, LIGHTNESS_MIN, LIGHTNESS_MAX);
      var data = {
        type: "light",
        message: {
          lightVal: normVal
        }
      };

      console.log("light:", normVal, "(", value, ")");
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

function light_sensor_callback(value, name){
  console.log(value + " " + name);
}

function pressure_sensor_callback(value, name){
  console.log(value + " " + name);
}

function flex_sensor_callback(value, name){
  console.log(value + " " + name);
}

function sensor_creator (name, inputPin, inputFreq, inputEvent, callback) {
  var sensor = new five.Sensor({
    pin: inputPin,
    freq: inputFreq
  });

  sensor.on(inputEvent, function(){
    callback(this.value, name)
  });
}
