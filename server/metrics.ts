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

export const metricsSendGPUTemperature: Metrics.Action = async (connection, duration = defaultDuration) => {
  const execAsync = promisify(exec);

  let isNvidiaGPU = true;

  try {
    const _result = await execAsync('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader');
  } catch (_) {
    isNvidiaGPU = false;
  }

  const intervalObj = setInterval(async () => {
    //TODO: get check gpu
    if (isNvidiaGPU) {
      const result = await execAsync('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader');
      connection.socket.send(+result.stdout || 0)
    } else {
      connection.socket.send(0)
    }
  }, duration)

  connection.socket.on('close', () => {
    clearInterval(intervalObj)
  })
}
