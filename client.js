const dgram = require('node:dgram');
var socket = dgram.createSocket({'type' : 'udp4', 'reuseAddr' : true});

socket.bind(1234, () => {
    socket.addMembership('224.0.0.114');
});

socket.on('listening', function () {
    let address = socket.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
});
  
socket.on('message', function (message, rinfo) {
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port + ' - ' + message);
    if(process.argv[2] == "T") {
        const message = "minha hora"
        socket.send(message, 0, message.length, rinfo.port, rinfo.address, function () {
            console.log("Sent '" + message + "'");
          });
    }
});

