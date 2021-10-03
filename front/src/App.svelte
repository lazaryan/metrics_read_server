<svelte:options tag="sl-widget-metrics"/>

<script lang="ts">
  import { onMount } from 'svelte';

  export let ws = import.meta.env.FRONT_WS_SERVER;

  onMount(() => {
    const socket = new WebSocket(ws);

    socket.addEventListener('open', function (event) {
      console.log('OPEN SOCKET!');
    });

    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });
  });
</script>

<main>
  Initial widget
</main>

<style>
  
</style>
