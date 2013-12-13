(function (){
  'use strict';
  var startButtonEl = $('.start-button');

  // Containers
  var initContainer = $('.init-container');
  var gameContainer = $('.game-container');

  // Timer
  var timerEl = $('.timer');
  var TIMER_INTERVAL = 1000;
  var GAME_TIMER_LIMIT = 10; // seconds

  /**
   * Timer object
   *
   * @param {Integer} timeLimitVal time limit in seconds
   * @param {Function} callback callback(currentTime)
   */
  var Timer = function(timeLimitVal, callback) {
    var self = this;
    var currentTime = 0;
    var timeLimit = timeLimitVal;
    var timerId;

    this.start = function() {
      timerId = setInterval(function() {
        currentTime = currentTime + 1;

        if (currentTime > timeLimit) {
          self.stop();
        } else {
          callback(currentTime);
        }
      }, TIMER_INTERVAL);
    };

    this.stop = function() {
      clearTimeout(timerId);
    };
  }

  var gameState = {
    init: function() {
      gameContainer.hide();

      startButtonEl.click(function() {
        initContainer.hide();
        gameState.start();
      });
    },

    start: function() {
      gameContainer.show();

      // Init time
      timerEl.text(GAME_TIMER_LIMIT);

      var timer = new Timer(GAME_TIMER_LIMIT, function(currentTime) {
        var timeLeft = GAME_TIMER_LIMIT - parseInt(currentTime, 10);

        // Update timer text
        timerEl.text(timeLeft);
      });

      timer.start();
    }
  };

  gameState.init();
})();