const dgram = require('dgram');
const readline = require('readline');
const keypress = require('keypress');
const PORT = 8889;
const HOST = '192.168.10.2';
const client = dgram.createSocket('udp4');
client.bind(PORT);

const dist = 20;
const deg = 10;


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function sendMessage(command) {
  client.send(command, 0, command.length, PORT, HOST, (err, bytes) => {
    if (err) throw err;
    console.log(`UDP message sent to ${HOST}:${PORT}`);
  });
}

client.on('message', (message, remote) => {
  console.log(`${remote.address}:${remote.port} - ${message}`);
});

(function userInput() {

  rl.question('Ready to fly?  ', (command) => {
    if (command === 'exit') {
      rl.close();
    } if (command ==='no') {
      userInput();
    } if (command ==='yes') {
      // make `process.stdin` begin emitting "keypress" events
      keypress(process.stdin);
      // listen for the "keypress" event
      process.stdin.on('keypress', function (ch, key) {
        //console.log('got "keypress"', key);
        if (key && key.ctrl && key.name == 'c') {
          process.stdin.pause();
        }
        if (key && key.name == 'return') {       // Take Off
          sendMessage('takeoff');
          console.log('Take Off!');
        }
        if (key && key.name == 'backspace') {    // Land
          sendMessage('land');
          console.log('Landing!');
        }
        if (key && key.name == 'escape') {      // Emergency
          sendMessage('emergency');
          console.log('S.O.S.');
        }
        if (key && key.name == 'w') {           // Fly Forward
          sendMessage('forward', dist);
          console.log('going forward!');
        }
        if (key && key.name == 's') {           // Fly Backward
          sendMessage('back', dist);
          console.log('going back!');
        }
        if (key && key.name == 'a') {           // Fly Left
          sendMessage('left', dist);
          console.log('going left!');
        }
        if (key && key.name == 'd') {           // Fly Right
          sendMessage('right', dist);
          console.log('going right!');
        }
        if (key && key.name == 'left') {        // Turn Left
          sendMessage('ccw', deg);
          console.log('turn left!');
        }
        if (key && key.name == 'right') {       // Turn Right
          sendMessage('cw', deg);
          console.log('going right!');
        }
        if (key && key.name == 'up') {          // Fly Up
          sendMessage('up', dist);
          console.log('going up!');
        }
        if (key && key.name == 'down') {        // Fly Down
          sendMessage('down', dist);
          console.log('going down!');
        }
      });
      process.stdin.setRawMode(true);
      process.stdin.resume();
    } else {
      userInput();
    }
  });
}());


