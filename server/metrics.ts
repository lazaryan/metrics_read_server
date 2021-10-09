import type { SocketStream } from 'fastify-websocket'
import si from 'systeminformation'

import { exec } from 'child_process'
import { promisify } from 'util'

import { Metrics } from 'types'

const defaultDuration = 1000;

export const metricsSendRandom: Metrics.Action = (connection, duration = defaultDuration) => {
  const max = 100;
  const min = -100;

  const intervalObj = setInterval(() => {
    const data = Math.floor(Math.random() * (max - min + 1)) + min;

    connection.socket.send(data)
  }, duration)

  connection.socket.on('close', () => {
    clearInterval(intervalObj)
  })
}

export const metricsSendCPUTemperature: Metrics.Action = (connection, duration = defaultDuration) => {
  const intervalObj = setInterval(async () => {
    const temperature = await si.cpuTemperature();
    connection.socket.send(temperature.main || 0)
  }, duration)

  connection.socket.on('close', () => {
    clearInterval(intervalObj)
  })
}

export const metricsSendGPUTemperature: Metrics.Action = (connection, duration = defaultDuration) => {
  const execAsync = promisify(exec);

  const intervalObj = setInterval(async () => {
    const result = await execAsync('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader');
    connection.socket.send(+result.stdout || 0)
  }, duration)

  connection.socket.on('close', () => {
    clearInterval(intervalObj)
  })
}
