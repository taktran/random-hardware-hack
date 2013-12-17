# Christmas novelty wall

A Christmas themed wall of hardware sensors, for the [pebblecode](http://pebblecode.com) Christmas themed [hackday 2013](http://blog.pebblecode.com/post/70184561422/pebble-hackmas-day-22-people-10-apps-8-hours).

When setup, it is a web based game, which connects up to a paper snowman face (through an arduino), which scores points when it's face is hit. There is also a time limit for hitting the face.

There is also a photo resistor (light sensor) that changes the background of the web site yellow when lit up.

Main libraries used:

* [Primus](http://primus.io/) for real time connections
* [Johnny five](https://github.com/rwaldron/johnny-five) for connecting to the arduino microcontroller

## Setup

Currently the setup only supports a simple circuit with a snowman face and a photo resistor.

### Set up the hardware

An example of the hardware setup:

![Hardware setup](http://f.cl.ly/items/3b1r063r3q2F0b3k421D/Screen%20Shot%202013-12-16%20at%2016-12-2013,%205.24.04%20PM.png)

#### Snowman face

The snowman face follows a similar circuit to https://github.com/rwaldron/johnny-five/blob/master/docs/pin.md

To set it up:

1. Cut out 2 pieces of paper in the shape of a snowman face.
2. On both pieces of paper, paint 2 dots in the middle with [bare conductive electronic paint](http://www.bareconductive.com/store/products/electric-paint-pen-10ml) or similar. Also connect the dots to the edge of the paper with the paint.
3. Connect the lines on the edge with wire, and connect one wire to the Ground pin, and the other to pin 13 of the arduino board.
4. Tape the two face pieces together, making sure that the conductive surfaces do not touch, unless pressed on. You may also need to sticky tape the lines that connect the middle circle to the edge so they don't accidently touch. Make sure that the 2 middle circles can have contact and complete the circuit though.
5. Paint the snowman face on one of the sides and put it into the scene.

#### Photo resistor

The photo resistor is wired up like this example: https://github.com/rwaldron/johnny-five/blob/master/docs/photoresistor.md

### Set up the software

1. Install pre-requisites

    npm install

2. Start the hardware/web app server

    node bin/novelty-wall.js

There are also various test files in `bin/playground` to test the hardware setup.

3. Start the web app

    grunt

View the site at [http://localhost:7770](http://localhost:7770), or your local (internal) ip address (useful for testing on other devices). You can also run

    grunt open

To run the site on another port, use the `port` flag eg,

    grunt --port=3000

To run the site using a different livereload port (default is `35729`), use the `lrp` flag (prevents this error: `Fatal error: Port 35729 is already in use by another process.`) eg,

    grunt --lrp=35720

