<template>
  <div id="app">
    <h1>Reporting Tool</h1>
    <pie-chart :svgSize="450" :donutRatio="0.23" :grouping="true" :groupingThreshold="5" valueKey="avg_spawns" labelKey="name" config="configs/pie_config_2.json"></pie-chart>
  </div>
</template>

<script>
import PieChart from './components/PieChart'

export default {
  name: 'app',
  components: {PieChart}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
