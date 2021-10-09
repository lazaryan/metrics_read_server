import Fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from 'fastify-static'
import FastifyWebSocket from 'fastify-websocket'

import path from 'path'

import {
  metricsSendRandom,
  metricsSendCPUTemperature,
  metricsSendGPUTemperature,
} from './metrics'

import type { Common, Metrics } from './types'

const server: FastifyInstance = Fastify({logger: true })

server.register(FastifyStatic, {
  root: path.join(__dirname, '../front/dist/')
})
server.register(FastifyWebSocket)

server.get('/', (req, repl) => {
  repl.sendFile('index.html')
})

const metricAction: Common.KeyValue<Metrics.Action> = {
  'random': metricsSendRandom,
  'cpu_temperature': metricsSendCPUTemperature,
  'gpu_temperature': metricsSendGPUTemperature,
}

server.get<{
  Params: { id: string }
}>('/connect/:id', { websocket: true }, (connection, req) => {
  const { id } = req.params;

  metricAction[id] && metricAction[id](connection)
})

server.get<{
  Params: { id: string, duration: string }
}>('/connect/:id/:duration', { websocket: true }, (connection, req) => {
  const { id, duration } = req.params;

  const actionDuration = (duration => duration < 1 ? 1 : duration > 20 ? 20 : duration)(Number(duration) || 0) * 1000

  metricAction[id] && metricAction[id](connection, actionDuration)
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
