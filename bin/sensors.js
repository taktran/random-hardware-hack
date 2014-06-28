var five = require("johnny-five"),board;

board = new five.Board();

board.on("ready", function() {
  sensor_creator("pressureSensor", "A0", 100, "data", pressure_sensor_callback);
  sensor_creator("flexSensor", "A2", 100, "data", flex_sensor_callback)
  sensor_creator("lightSensor", "A1" ,100, "change", light_sensor_callback)
});

function light_sensor_callback(value, name){
  console.log(value + " " + name);
}

function pressure_sensor_callback(value, name){
  console.log(value + " " + name);
}

function flex_sensor_callback(value, name){
  console.log(value + " " + name);
}

function sensor_creator (name, inputPin, inputFreq, inputEvent, callback) {
  sensor = new five.Sensor({
    pin: inputPin,
    freq: inputFreq
  });

  sensor.on(inputEvent, function(){
    callback(this.value, name)
  });
}
