/*jshint -W064 */
/*global Primus: true, Snap: true*/
(function (){
  'use strict';

  // Container

  // ---------------------------------------
  // Snap svg
  // ---------------------------------------
  
  var imageSel = '#rolly-polly';
  var imagePath = '../img/ms-squiggle.svg';
  var image = Snap(imageSel);

  Snap.load(imagePath, function(f) {
    image.append(f);

    // var face = f.select("#face");
    var hat = image.select("#hat");
    // var leftUpperArm = f.select("#left-upper-arm");
    // var rightUpperArm = f.select("#rightUpperArm");
    // var body = f.select("#body");
    // var legRoll = f.select("#legRoll");

    // For debugging
    window.hat = hat;

    var hatBtnSel = ".hat-btn";
    var hatBtn = $(hatBtnSel);
    hatBtn.click(function() {
      hat.toggleClass('hide');
      hatBtn.toggleClass('active');
    });

  });

  // ---------------------------------------
  // Primus connection
  // ---------------------------------------

  var PRIMUS_URL = 'http://localhost:9999/';
  var primus = Primus.connect(PRIMUS_URL);

  primus.on('open', function open() {
    console.log('Connection open');
  });

  primus.on('error', function error(err) {
    console.error('Error:', err, err.message);
  });

  primus.on('reconnect', function() {
    console.log('Reconnect attempt started');
  });

  primus.on('reconnecting', function(opts) {
    console.log('Reconnecting in %d ms', opts.timeout);
    console.log('This is attempt %d out of %d', opts.attempt, opts.retries);
  });

  primus.on('end', function () {
    console.log('Connection closed');
  });

  primus.on('data', function(rawData) {
    var data = JSON.parse(rawData);
    // var messageType = data["type"];
    // var message = data["message"];

    console.log(data);
  });

})();