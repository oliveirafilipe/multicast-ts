import dgram, { RemoteInfo } from "dgram";

const SRC_PORT = 6025;
const PORT = 1234;
const MULTICAST_ADDR = "224.0.0.114";
const server = dgram.createSocket("udp4");

server.bind(SRC_PORT, function () {
  setInterval(function () {
    let message = "Hello from server - What time is it?";
    server.send(message, 0, message.length, PORT, MULTICAST_ADDR, function () {
      console.log("Sent '" + message + "'");
    });
  }, 4000);
});

server.on("message", function (message: string, rinfo: RemoteInfo) {
  console.log(
    "Message from: " + rinfo.address + ":" + rinfo.port + " - " + message
  );
});
