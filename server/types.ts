import type { SocketStream } from 'fastify-websocket'

export namespace Common {
  export type KeyValue<T = string> = {
    [key: string]: T;
  }
}

export namespace Metrics {
  export type Action = (connection: SocketStream, duration?: number) => void;
}
