import dgram, { RemoteInfo, Socket } from "node:dgram";

export namespace MulticastSocketCreator {
  export const start = async (port: number) => {
    const socket = dgram.createSocket({
      type: "udp4",
      reuseAddr: true,
    });

    return new Promise<MSInstance>((res, rej) => {
      socket.on("listening", () => res(new MSInstance(socket, port)));
      socket.bind(port, () => {});
    });
  };
}

class MSInstance {
  socket: Socket;
  multicastAddr: string;
  multicastPort: number;
  receivePromise: any;
  messageListener: any;

  constructor(socket: Socket, multicastPort: number) {
    this.socket = socket;
    this.multicastPort = multicastPort;
    const thisRef = this;
    this.socket.on("message", (message: Buffer, rinfo: RemoteInfo) =>
      this._listener({ message, rinfo }, thisRef)
    );
  }

  join(multicastAddr: string) {
    this.multicastAddr = multicastAddr;
    this.socket.addMembership(multicastAddr);
  }

  async send(
    message: string,
    address = this.multicastAddr,
    port = this.multicastPort
  ) {
    return new Promise((res, rej) => {
      const bufferedMessage = Buffer.from(message, "utf-8");
      this.socket.send(
        bufferedMessage,
        0,
        bufferedMessage.length,
        port,
        address,
        res
      );
    });
  }

  onMessage(listener: (data: Message) => void) {
    this.messageListener = listener;
  }

  async receive(): Promise<{
    message: string;
    rinfo: { address: string; port: number };
  }> {
    return new Promise((res, rej) => {
      this.receivePromise = res;
    });
  }

  _listener(data: Message, thisRef: MSInstance) {
    if (thisRef.messageListener) {
      thisRef.messageListener(data);
    }
    if (thisRef.receivePromise) {
      thisRef.receivePromise(data);
      thisRef.receivePromise = undefined;
    }
  }
}

export type Message = { message: Buffer; rinfo: RemoteInfo };
