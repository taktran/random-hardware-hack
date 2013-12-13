// Timer object
(function() {
  "use strict";
  var TIMER_INTERVAL = 1000;

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
  };

  module.exports = Timer;
})();
