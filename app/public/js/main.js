/*global Primus: true*/
(function (){
  'use strict';

  // ---------------------------------------
  // Primus connection
  // ---------------------------------------

  var PRIMUS_URL = 'http://localhost:9999/';
  var primus = Primus.connect(PRIMUS_URL);

  primus.on('open', function open() {
    console.log('Connection open');

    initGame();
  });

  primus.on('error', function error(err) {
    console.error('Error:', err, err.message);
  });

  primus.on('reconnect', function () {
    console.log('Reconnect attempt started');
  });

  primus.on('reconnecting', function (opts) {
    console.log('Reconnecting in %d ms', opts.timeout);
    console.log('This is attempt %d out of %d', opts.attempt, opts.retries);
  });

  primus.on('end', function () {
    console.log('Connection closed');
  });

  primus.on('data', function message(rawData) {
    var data = JSON.parse(rawData);
    var messageType = data["type"];

    // console.log(data);

    if (messageType === "timer") {
      // Update timer
      console.log("Timer");
    }
  });

  // ---------------------------------------
  // Game setup
  // ---------------------------------------

  function initGame() {
    // Buttons
    var startButtonEl = $('.start-button');
    var restartButtonEl = $('.restart-button');

    // Containers
    var initContainer = $('.init-container');
    var gameContainer = $('.game-container');

    var gameState = {
      init: function() {
        initContainer.show();
        gameContainer.hide();

        primus.write({
          type: "gameState",
          message: "init"
        });
      },

      start: function() {
        initContainer.hide();
        gameContainer.show();

        primus.write({
          type: "gameState",
          message: "start"
        });
      },

      restart: function() {
        gameState.init();

        primus.write({
          type: "gameState",
          message: "restart"
        });
      }
    };

    // ---------------------------------------
    // Events
    // ---------------------------------------

    startButtonEl.click(function() {
      gameState.start();
    });

    restartButtonEl.click(function() {
      gameState.restart();
    });

    gameState.init();
  }
})();