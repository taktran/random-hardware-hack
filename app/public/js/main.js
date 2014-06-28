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
    var face = image.select("#face");
    var leftUpperArm = image.select("#left-upper-arm");
    var rightUpperArm = image.select("#right-upper-arm");
    var leftLowerArm = image.select("#left-lower-arm");
    var rightLowerArm = image.select("#right-lower-arm");
    var body = image.select("#body");
    var legRollLarge = image.select("#leg-roll-large");
    var smallRollLarge = image.select("#leg-roll-small");

    // For debugging
    window.hat = hat;
    window.legRollLarge = legRollLarge;
    window.image = image;

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

    var brokenRollBtn = ".broken-roll-btn";
    $(brokenRollBtn).click(function() {
      var animationTime = 600;
      var animationBackTime = 600;
      var rotation = 500;
      var xMove = -200;

      legRollLarge.animate({
        transform: "t0,0 R" + rotation
      }, animationTime, mina.easeout, function() {
        // Come back
        legRollLarge.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      
      smallRollLarge.animate({
        transform: "t0,0 R" + -rotation // Negate rotation
      }, animationTime, mina.easeout, function() {
        // Come back
        smallRollLarge.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });

      var allImages = Snap.selectAll("g");
      allImages.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        allImages.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
    });

    var rollLeftBtn = ".roll-left-btn";
    $(rollLeftBtn).click(function() {
      var animationTime = 600;
      var animationBackTime = 600;
      var largeRotation = 200;
      var smallRotation = -500;
      var xMove = -200;

      legRollLarge.animate({
        transform: "t" + xMove + ",0,r" + largeRotation
      }, animationTime, mina.easeout, function() {
        // Come back
        legRollLarge.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });

      smallRollLarge.animate({
        transform: "t" + xMove + ",0,r" + smallRotation
      }, animationTime, mina.easeout, function() {
        // Come back
        smallRollLarge.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });

      // 
      hat.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        hat.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      leftUpperArm.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        leftUpperArm.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      rightUpperArm.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        rightUpperArm.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      leftLowerArm.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        leftLowerArm.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      rightLowerArm.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        rightLowerArm.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      body.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        body.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
      });
      face.animate({
        transform: "t" + xMove + ",0"
      }, animationTime, mina.easeout, function() {
        // Come back
        face.animate({
          transform: "t0,0"
        }, animationBackTime, mina.easein);
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