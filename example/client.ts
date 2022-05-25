import { Message, MulticastSocket } from "../MulticastSocket";

async function main() {
  const socket = new MulticastSocket();
  await socket.start(1234);

  console.log("Client is Up. Listening for multicast messages");

  const onMessage = ({ message, rinfo }: Message) => {
    console.log(
      "Message from: " + rinfo.address + ":" + rinfo.port + " - " + message
    );
    const messageToSend = new Date().toISOString();
    socket.send(messageToSend, rinfo.address, rinfo.port);
  };

  socket.join("224.0.0.114");

  socket.onMessage(onMessage);

  console.log(await socket.receive());
}

main();
