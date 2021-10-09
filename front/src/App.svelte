<svelte:options tag="sl-widget-metrics"/>

<script lang="ts">
  import './Chart.svelte';
</script>

<main>
  <h1>Metrics!!!</h1>
  <div class="columns-metrics">
    <div class="metric">
      <sl-widget-metrics-chart
        title="Рандомные числа"
        metric="random"
        theme="dataviz"
        maxdot="50"
        ws={import.meta.env.FRONT_WS_SERVER || window.location.host}
      ></sl-widget-metrics-chart>
    </div>
    <div class="metric">
      <sl-widget-metrics-chart
        title="Температура GPU сервера"
        metric="gpu_temperature"
        ws={import.meta.env.FRONT_WS_SERVER || window.location.host}
        maxdot="50"
      ></sl-widget-metrics-chart>
    </div>
  </div>
  <div class="columns-metrics">
    <div class="metric">
      <sl-widget-metrics-chart
        title="Рандомные числа (с изменением задержки)"
        metric="random"
        theme="dataviz"
        maxdot="50"
        duration="5"
        ws={import.meta.env.FRONT_WS_SERVER || window.location.host}
      ></sl-widget-metrics-chart>
    </div>
  </div>
</main>

<style>
  h1 {
    font-weight: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .columns-metrics {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .columns-metrics .metric {
    width: 49%;
    height: 100%;
  }
</style>
