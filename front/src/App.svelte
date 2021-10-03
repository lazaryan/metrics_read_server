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
      ></sl-widget-metrics-chart>
    </div>
    <div class="metric">
      <sl-widget-metrics-chart
        title="Температура GPU сервера"
        metric="gpu_temperature"
        theme="dataviz"
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
    height: 250px;
    justify-content: space-between;
  }

  .columns-metrics .metric {
    width: 45%;
    height: 100%;
  }
</style>
