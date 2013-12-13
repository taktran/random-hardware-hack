/*global Primus: true*/
(function (){
  'use strict';
  var gameInfo = {};

  // Buttons
  var startButtonEl = $('.start-button');
  var restartButtonEl = $('.restart-button');

  // Containers
  var initContainer = $('.init-container');
  var gameContainer = $('.game-container');

  // Game info
  var timerEl = $('.timer');
  var scoreEl = $('.score');
  var gameOverModal = $('#gameOverModal');

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

  primus.on('data', function(rawData) {
    var data = JSON.parse(rawData);
    var messageType = data["type"];
    var message = data["message"];

    // console.log(data);

    if (messageType === "timer") {
      var timeLeft = message.timeLeft;
      timerEl.text(timeLeft);
    } else if (messageType === "info") {

      gameInfo.timeLimit = message["timeLimit"];
      timerEl.text(gameInfo.timeLimit);

      gameInfo.score = message["score"];
      scoreEl.text(gameInfo.score);
    } else if (messageType === "score") {
      gameInfo.score = message["score"];
      scoreEl.text(gameInfo.score);
    } else if (messageType === "gameOver") {
      gameOverModal.modal();
    } else if (messageType === "light") {
      if (!message.lowLight) {
        $("body").addClass("light");
      } else {
        $("body").removeClass("light");
      }
    }
  });

  // ---------------------------------------
  // Game setup
  // ---------------------------------------

  function initGame() {

    var gameState = {
      init: function() {
        initContainer.show();
        gameContainer.hide();
        gameOverModal.modal('hide');

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