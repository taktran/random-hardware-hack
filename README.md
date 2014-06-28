# Random hardware hack

A random hardware hack, where we built stuff...

Have a look in `bin`.

Hacked off the [Christmas novelty wall](https://github.com/pebblecode/christmas-novelty-wall).

Main libraries used:

* [Primus](http://primus.io/) for real time connections
* [Johnny five](https://github.com/rwaldron/johnny-five) for connecting to the arduino microcontroller

## Setup

Currently the setup only supports a simple circuit with a snowman face and a photo resistor.

#### Photo resistor

The photo resistor is wired up like this example: https://github.com/rwaldron/johnny-five/blob/master/docs/photoresistor.md

### Set up the software

1. Install pre-requisites

    npm install

2. Start the hardware/web app server

    node bin/ms-squiggle.js

There are also various test files in `bin/playground` to test the hardware setup.

3. Start the web app

    grunt

View the site at [http://localhost:7770](http://localhost:7770), or your local (internal) ip address (useful for testing on other devices). You can also run

    grunt open

To run the site on another port, use the `port` flag eg,

    grunt --port=3000

To run the site using a different livereload port (default is `35729`), use the `lrp` flag (prevents this error: `Fatal error: Port 35729 is already in use by another process.`) eg,

    grunt --lrp=35720

