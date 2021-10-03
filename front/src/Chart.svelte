<svelte:options tag="sl-widget-metrics-chart"/>

<script lang="ts">
  import { onMount } from 'svelte'

  import initChart from './utils/initChart'
  import type { Themes } from './utils/initChart'

  export let ws = import.meta.env.FRONT_WS_SERVER || window.location.host
  export let title = 'Неизвестная'
  export let metric = 'random'
  export let theme: Themes = 'material'

  let ref: HTMLDivElement;
  let initialLoading: boolean = true;

  onMount(() => {
    function* generateSetData () {
      const initialData = []

      for (let i = 0; i < 3; i++) {
        const item = yield;
        initialData.push(item)
      }

      initialLoading = true;

      const item = yield;
      initialData.push(item)

      const chart = initChart(ref, initialData, theme)
      
      while (true) {
        const item = yield;
        chart.addData(item)
      }
    }

    const gen = generateSetData();
    gen.next();

    const socket = new WebSocket(`ws://${ws}/connect/${metric}`);

    socket.addEventListener('open', (event) => {
      console.log('OPEN SOCKET!', metric);
    });

    socket.addEventListener('message', (event) => {
      gen.next({ value: event.data, date: new Date() })
    });
  })
</script>

<div>
  <h2>Метрика: {title}</h2>
  <div class="chart" bind:this={ref}></div>
</div>

<style>
  .chart {
    height: 500px;
  }
</style>