const SRC_PORT = 6025;
const PORT = 1234;
const MULTICAST_ADDR = '224.0.0.114';
const LOCAL_IP = '10.32.160.243';
const dgram = require('dgram');
const server = dgram.createSocket("udp4");

server.bind(SRC_PORT, LOCAL_IP, function () {
  setInterval(function () {
    //let message = new Buffer(new Date().toLocaleTimeString());
    let message = "Ola from"
    server.send(message, 0, message.length, PORT, MULTICAST_ADDR, function () {
      console.log("Sent '" + message + "'");
    });
  }, 4000);
});

server.on('message', function (message, rinfo) {
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
});