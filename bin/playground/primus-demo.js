// Server to connect to hardware

'use strict';

var Primus = require('primus');

var http = require('http');
var server = http.createServer();
var primus = new Primus(server, {
  transformer: 'sockjs'
});

var connections = {};

// --------------------------------------------
// Real time connection
// --------------------------------------------

primus.on('connection', function(spark) {
  var gameState;
  console.log('connection:\t', spark.id);

  // Store connections based on spark id.
  // Retrieve it if it already exists
  if (!connections[spark.id]) {
    connections[spark.id] = {};
  }

  spark.write(JSON.stringify({
    type: "connection",
    message: "Hello"
  }));

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

