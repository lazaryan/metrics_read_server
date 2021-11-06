<svelte:options tag="sl-widget-metrics-chart"/>

<script lang="ts">
  import { onMount } from 'svelte'

  import initChart from './utils/initChart'
  import type { Themes } from './utils/initChart'
  import type { XYChart } from '@amcharts/amcharts4/charts'

  import IconLoader from './assets/loader.svg';

  export let title = 'Неизвестная'
  export let metric = 'random'
  export let theme: Themes = 'material'
  export let maxdot = 100
  export let duration: number | null = 0

  let ref: HTMLDivElement;
  let initialLoading: boolean = true;
  let errorConnect: boolean = false;

  onMount(() => {
    async function* generateSetData () {
      const maxViewDot = (count => count < 10 ? 10 : count)(+maxdot);
      const initialData = [];
      let addedDots = 0;

      for (let i = 0; i < 2; i++) {
        const item = yield;
        addedDots++;
        initialData.push(item)
      }

      initialLoading = false;

      const chart: XYChart = await new Promise((resolve) => {
        setTimeout(() => resolve(initChart(ref, initialData, theme)), 100)
      })
      
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

    const socket = new WebSocket(`ws://${window.location.host}/ws/connect/${metric}${duration ? `/${duration}` : ''}`);

    socket.addEventListener('open', (event) => {
      console.log('OPEN SOCKET!', metric);
    });

    socket.addEventListener('message', (event) => {
      gen.next({ value: event.data, date: new Date() })
    });

    socket.addEventListener('close', (error) => {
      initialLoading = false;
      errorConnect = true;
    })

    socket.addEventListener('error', (error) => {
      initialLoading = false;
      errorConnect = true;
    })
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
  {#if errorConnect}
    <div class="error-block">
      <p><span class="big-text">OOOOPS!!!</span> Произошла ошибка в считывание метрики</p>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    border: 5px solid rgb(26, 77, 187);
    background: ghostwhite;
    border-radius: 30px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
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
    min-height: 350px;
  }

  .error-block {
    height: 340px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0b4b491;
    box-shadow: 0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent;
    border-radius: 20px;
    margin: 10px;
    position: absolute;
    top: 70px;
    width: calc(100% - 40px);
  }

  .error-block .big-text {
    color: #912d2b;
    font-size: 24px;
    font-weight: bold;
  }

  .error-block p {
    color: #9f3a38;
    font-size: 20px;
  }

  .chart {
    min-height: 350px;
    height: 100%;
  }
</style>