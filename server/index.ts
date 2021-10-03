import Fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from 'fastify-static'
import FastifyWebSocket from 'fastify-websocket'

import path from 'path'

import {
  metricsSendRandom,
  metricsSendCPUTemperature,
  metricsSendGPUTemperature,
} from './metrics'

const server: FastifyInstance = Fastify({logger: true })

server.register(FastifyStatic, {
  root: path.join(__dirname, '../front/dist/')
})
server.register(FastifyWebSocket)

server.get('/', (req, repl) => {
  repl.sendFile('index.html')
})

server.get<{
  Params: { id: 'random' }
}>('/connect/:id', { websocket: true }, (connection, req) => {
  const { id } = req.params;

  const metricAction = {
    'random': metricsSendRandom,
    'cpu_temperature': metricsSendCPUTemperature,
    'gpu_temperature': metricsSendGPUTemperature,
  }

  metricAction[id] && metricAction[id](connection)
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
