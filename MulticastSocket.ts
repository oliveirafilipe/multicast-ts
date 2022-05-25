import dgram, { RemoteInfo, Socket } from "node:dgram";

export type Message = { message: Buffer; rinfo: RemoteInfo };

export class MulticastSocket {
  #socket: Socket;
  #multicastAddr: string;
  #multicastPort: number;
  #receivePromise: any;
  #messageListener: any;

  constructor() {}

  start(multicastPort: number) {
    if (this.#socket) return Promise.resolve();
    this.#socket = dgram.createSocket({
      type: "udp4",
      reuseAddr: true,
    });

    this.#multicastPort = multicastPort;
    this.#socket.on("message", (message: Buffer, rinfo: RemoteInfo) =>
      this.#listener({ message, rinfo }, this)
    );

    return new Promise<void>((res, rej) => {
      this.#socket.on("listening", () => res());
      this.#socket.bind(this.#multicastPort, () => {});
    });
  }

  join(multicastAddr: string) {
    this.#multicastAddr = multicastAddr;
    this.#socket.addMembership(multicastAddr);
  }

  async send(
    message: string,
    address = this.#multicastAddr,
    port = this.#multicastPort
  ) {
    return new Promise((res, rej) => {
      const bufferedMessage = Buffer.from(message, "utf-8");
      this.#socket.send(
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
    this.#messageListener = listener;
  }

  async receive(): Promise<{
    message: string;
    rinfo: { address: string; port: number };
  }> {
    return new Promise((res, rej) => {
      this.#receivePromise = res;
    });
  }

  #listener(data: Message, thisRef: MulticastSocket) {
    if (thisRef.#messageListener) {
      thisRef.#messageListener(data);
    }
    if (thisRef.#receivePromise) {
      thisRef.#receivePromise(data);
      thisRef.#receivePromise = undefined;
    }
  }
}
