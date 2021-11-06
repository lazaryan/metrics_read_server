<svelte:options tag="sl-widget-metrics"/>

<script lang="ts">
  import './Chart.svelte';
</script>

<main>
  <h1>Проект для считывания метрик</h1>
  <div class="columns-metrics">
    <div class="metric">
      <sl-widget-metrics-chart
        title="Рандомные числа"
        metric="random"
        theme="dataviz"
        maxdot="50"
      ></sl-widget-metrics-chart>
    </div>
    <div class="metric">
      <sl-widget-metrics-chart
        title="Температура CPU сервера"
        metric="cpu_temperature"
        maxdot="100"
      ></sl-widget-metrics-chart>
    </div>
  </div>
  <div class="columns-metrics">
    <div class="metric">
      <sl-widget-metrics-chart
        title="Температура GPU сервера"
        metric="gpu_temperature"
        maxdot="100"
      ></sl-widget-metrics-chart>
    </div>
    <div class="metric">
      <sl-widget-metrics-chart
        title="Рандомные числа (с изменением задержки)"
        metric="random"
        theme="dataviz"
        maxdot="50"
        duration="5"
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
