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
    var timeLimit = timeLimitVal;
    var timerId;

    this.currentTime = 0;

    this.start = function() {
      var self = this;
      timerId = setInterval(function() {
        self.currentTime = self.currentTime + 1;

        if (self.currentTime > timeLimit) {
          self.stop();
        } else {
          callback(self.currentTime);
        }
      }, TIMER_INTERVAL);
    };

    this.stop = function() {
      clearTimeout(timerId);
    };
  };

  module.exports = Timer;
})();
