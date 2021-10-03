<svelte:options tag="sl-widget-metrics"/>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { EventEmitter } from 'events'

  import './Chart.svelte';

  export let ws = import.meta.env.FRONT_WS_SERVER || window.location.host;

  let chartEmitter: EventEmitter | null = null;

  const handleCreateEvent = ({ detail }: CustomEvent<EventEmitter>) => {
    chartEmitter = detail;
  }

  onMount(() => {
    const socket = new WebSocket(`ws://${ws}/connect`);

    socket.addEventListener('open', function (event) {
      console.log('OPEN SOCKET!');
    });

    socket.addEventListener('message', function (event) {
      chartEmitter && chartEmitter.emit('add', event.data);
    });
  });
</script>

<main>
  <h1>Metrics!!!</h1>
  <sl-widget-metrics-chart
    on:createemmiter={handleCreateEvent}
  ></sl-widget-metrics-chart>
</main>

<style>
  h1 {
    font-weight: 1.5rem;
    margin-bottom: 1.5rem;
  }
</style>
