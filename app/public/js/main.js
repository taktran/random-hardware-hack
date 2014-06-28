/*global Primus: true*/
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
    var g = f.select("svg");
    image.append(g);
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