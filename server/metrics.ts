import type { SocketStream } from 'fastify-websocket'

const getData = async () => {
  const max = 100;
  const min = -100;
  
  return await Math.floor(Math.random() * (max - min + 1)) + min;
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
