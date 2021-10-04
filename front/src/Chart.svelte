<svelte:options tag="sl-widget-metrics-chart"/>

<script lang="ts">
  import { onMount } from 'svelte'

  import initChart from './utils/initChart'
  import type { Themes } from './utils/initChart'

  import IconLoader from './assets/loader.svg';

  export let ws = location.host
  export let title = 'Неизвестная'
  export let metric = 'random'
  export let theme: Themes = 'material'
  export let maxdot = 100

  let ref: HTMLDivElement;
  let initialLoading: boolean = true;

  onMount(() => {
    console.log(IconLoader)
    function* generateSetData () {
      const maxViewDot = (count => count < 10 ? 10 : count)(+maxdot);
      const initialData = [];
      let addedDots = 0;

      for (let i = 0; i < 3; i++) {
        const item = yield;
        addedDots++;
        initialData.push(item)
      }

      initialLoading = false;

      const item = yield;
      addedDots++
      initialData.push(item)

      const chart = initChart(ref, initialData, theme)
      
      while (true) {
        const item = yield;
        chart.addData(item)

        if (addedDots > maxViewDot) {
          chart.removeData(1)
        } else {
          addedDots++
        }
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

<div class="wrapper">
  <h2 class="title">Метрика: {title}</h2>
  {#if initialLoading}
    <div class="loader">
      <img src={IconLoader} alt="loader" />
    </div>
  {:else}
    <div class="chart" bind:this={ref}></div>
  {/if}
</div>

<style>
  .wrapper {
    border: 5px solid rgb(26, 77, 187);
    background: ghostwhite;
    border-radius: 30px;
    padding: 10px;
    box-sizing: border-box;
  }

  .title {
    text-align: center;
    border-bottom: 2px solid #222;
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 250px;
  }

  .chart {
    min-height: 350px;
    height: 100%;
  }
</style>