import type { SocketStream } from 'fastify-websocket'

const getData = async () => {
  return await Math.random() * 100
}

export const metricsSend = (connection: SocketStream) => {
  const intervalObj = setInterval(async () => {
    const data = await getData()

    connection.socket.send(data)
  }, 1000)

  connection.socket.on('close', () => {
    clearInterval(intervalObj)
  })
}

export default metricsSend;
