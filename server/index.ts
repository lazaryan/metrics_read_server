import Fastify, { FastifyInstance } from 'fastify'
import FastifyStatic from 'fastify-static'

import path from 'path';

const server: FastifyInstance = Fastify({logger: true })

server.register(FastifyStatic, {
  root: path.join(__dirname, '../front/dist/')
})

server.get('/', (req, repl) => {
  repl.sendFile('index.html')
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
