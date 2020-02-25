// Drone Controle
const dgram = require('dgram');
const wait = require('waait');
const app = require('express')();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const throttle = require('lodash/throttle');
const commandDelays = require('./commandDelays');

const PORT = 8889;
const HOST = '192.168.10.1';

const drone = dgram.createSocket('udp4');
drone.bind(PORT);


const droneState = dgram.createSocket('udp4');
droneState.bind(8890);


drone.on('message', message => {
  console.log(`🤖 : ${message}`);
  io.sockets.emit('status', message.toString());
});

let distance = 50;
const flightPlan = ['command', 'battery?', 'takeoff', 'right'+distance, 'forward'+distance, 'left'+distance, 'back'+distance, 'land'];

let i = 0;
let local = {
    X: 0,
    Y: 0,
    Z: 0
}
async function go() {
    const command = flightPlan[i];
    const delay = commandDelays[command];
    console.log(`running cammand: ${command}`);
    drone.send(command, 0, command.length, PORT, HOST, handleError);
    await wait(delay);
    i += i;
    track(command, distance);
    console.log(local);
    if (i<flightPlan.length){
        return go();
    }
    console.log('Flight Plan Complete.')
}

go();


function track(command, distance) {
    if (command == forward || back) {
        if (command == forward){
            local.X = local.X + distance;
        }
        else {local.X = local.X - distance;}
    }
    if (command == right || left) {
        if (command == right){
            local.Y = local.Y + distance;
        }
        else {local.Y = local.Y - distance;}
    }
    else {return}
}


// function parseState(state) { 
//     return state
//       .split(';')
//       .map(x => x.split(':'))
//       .reduce((data, [key, value]) => {
//         data[key] = value;
//         return data;
//       }, {});
//   }


function handleError(err) {
    if (err) {
      console.log('ERROR');
      console.log(err);
    }
  }


http.listen(6767, () => {
  console.log('Socket io server up and running');
});
