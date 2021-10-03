<svelte:options tag="sl-widget-metrics-chart"/>

<script lang="ts">
  import { onMount } from 'svelte'
  import EventEmitter from 'events'

  import createDispatch from './utils/dispatch'
  import initChart from './utils/initChart'

  const emitter = new EventEmitter();
  const dispatch = createDispatch();

  let ref: HTMLDivElement;

  onMount(() => {
    function* generateSetData () {
      const initialData = []

      for (let i = 0; i < 4; i++) {
        const item = yield;
        initialData.push(item)
      }

      const chart = initChart(ref, initialData)
      
      while (true) {
        const item = yield;
        chart.addData(item)
      }
    }

    const gen = generateSetData();
    gen.next();

    emitter.on('add', el => {
      gen.next({ value: el, date: new Date() })
    });

    setTimeout(() => {
      dispatch('createemmiter', emitter)
    }, 0);
  })
</script>

<div>
  <div class="chart" bind:this={ref}></div>
</div>

<style>
  .chart {
    height: 500px;
  }
</style>