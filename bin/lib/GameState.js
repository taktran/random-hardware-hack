// Game state object
(function() {
  "use strict";

  var Timer = require("./Timer");

  var GameState = function(spark, timerLimit) {
    this.score = 0;
    this.spark = spark;
    this.timer;
    this.timerLimit = timerLimit;
  }

  GameState.prototype.incrementScore = function() {
    this.score = this.score + 1;
  };

  GameState.prototype.resetScore = function() {
    this.score = 0;
  };

  GameState.prototype.isGameOver = function() {
    return (this.timerLimit - this.timer.currentTime) <= 0;
  };

  GameState.prototype.init = function() {
    var self = this;

    self.resetScore();
    if (this.timer) {
      this.timer.stop();
    }

    var data = {
      type: "info",
      message: {
        timeLimit: self.timerLimit,
        score: self.score
      }
    };

    self.spark.write(JSON.stringify(data));
  };

  GameState.prototype.start = function() {
    var self = this;

    this.timer = new Timer(self.timerLimit, function(currentTime) {
      var timeLeft = self.timerLimit - parseInt(currentTime, 10);
      var data = {
        type: "timer",
        message: {
          timeLeft: timeLeft,
          currentTime: currentTime
        }
      };

      self.spark.write(JSON.stringify(data));


      if (self.isGameOver()) {
        var gameOverData = {
          type: "gameOver"
        };

        self.spark.write(JSON.stringify(gameOverData));
      }
    });

    this.timer.start();
  };

  GameState.prototype.restart = function() {
    this.timer.stop();
  };

  module.exports = GameState;
})();
