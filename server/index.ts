import Fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from 'fastify-static'
import FastifyWebSocket from 'fastify-websocket'

import path from 'path';

const server: FastifyInstance = Fastify({logger: true })

server.register(FastifyStatic, {
  root: path.join(__dirname, '../front/dist/')
})
server.register(FastifyWebSocket)

server.get('/', (req, repl) => {
  repl.sendFile('index.html')
})

server.get('/connect', { websocket: true }, (connection, req) => {
  connection.socket.send('hi from server')
})

const start = async () => {
  try {
    await server.listen(3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  } 
}

start()
