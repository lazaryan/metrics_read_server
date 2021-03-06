import Fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from 'fastify-static'
import FastifyWebSocket from 'fastify-websocket'
import FastifyCors from 'fastify-cors';

import path from 'path'

import {
  metricsSendRandom,
  metricsSendCPUTemperature,
  metricsSendGPUTemperature,
} from './metrics'

import type { Common, Metrics } from './types'

const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const client = new mongo(url)
let db
let collection = {};

const server: FastifyInstance = Fastify({ logger: true })

server.register(FastifyStatic, {
  root: path.join(__dirname, '../front/dist/')
})
server.register(FastifyWebSocket)
server.register(FastifyCors)

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

  //@ts-ignore
  collection.insertOne({
    id: req.id,
    params: req.params,
    user_agent: req.headers['user-agent'],
    url: req.url
  })
})

server.get<{
  Params: { id: string, duration: string }
}>('/connect/:id/:duration', { websocket: true }, (connection, req) => {
  const { id, duration } = req.params;

  const actionDuration = (duration => duration < 1 ? 1 : duration > 20 ? 20 : duration)(Number(duration) || 0) * 1000

  metricAction[id] && metricAction[id](connection, actionDuration)

    //@ts-ignore
    collection.insertOne({
      id: req.id,
      params: req.params,
      user_agent: req.headers['user-agent'],
      url: req.url
    })
})

const start = async () => {
  try {
    await server.listen(3000)
    await client.connect()
    console.log('Connected successfully to server')
    db = client.db("MetriClients")
    collection = db.collection('documents')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  } 
}

start()