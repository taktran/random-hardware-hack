/*jshint -W064 */
/*global Primus: true, Snap: true, mina: true*/
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
    var legRollLarge = image.select("#leg-roll-large");

    // For debugging
    window.hat = hat;
    window.legRollLarge = legRollLarge;

    // Show/Hide hat
    var hatHideBtnSel = ".hat-hide-btn";
    var hatHideBtn = $(hatHideBtnSel);
    hatHideBtn.click(function() {
      hat.toggleClass('hide');

      hatHideBtn.toggleClass('btn-primary');
      hatHideBtn.toggleClass('btn-default');
    });

    // Tip the hat
    var hatTipBtnSel = ".hat-tip-btn";
    $(hatTipBtnSel).click(function() {
      var startDeg = 0;
      var toDeg = 3;
      var startMoveTime = 700;
      var endMoveTime = 700;

      hat.animate({
        transform: "t0,0 R " + toDeg
      }, startMoveTime, mina.elastic, function() {
        hat.animate({
          transform: "t0,0 R " + startDeg
        }, endMoveTime, mina.linear);
      });
    });

    var hatRollBtnSel = ".hat-roll-btn";
    $(hatRollBtnSel).click(function() {
      hat.animate({
        transform: "t-85,-30 R -90"
      }, 300, mina.easeout, function() {
        // Come back
        hat.animate({
          transform: "t0,0"
        }, 300, mina.easein);
      });
    });

    var rollBtnSel = ".roll-left-btn";
    $(rollBtnSel).click(function() {

      legRollLarge.animate({
        transform: "t-100,0 R 360,341.454,445.164"
      }, 300, mina.easeout, function() {
        // Come back
        legRollLarge.animate({
          transform: "t0,0"
        }, 300, mina.easein);
      });
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