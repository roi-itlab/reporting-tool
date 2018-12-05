<template>
  <div id="app">
    <h1>Reporting Tool</h1>
    <Legend></Legend>
    <piechart 
      :outerRadius='250' 
      :innerRadius='0'
      :arcPadding='50' 
      :grouping='true' 
      :groupingThreshold='5' 
      :colorscheme='["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]'
      :valueKey='"avg_spawns"'
      :labelKey='"name"'
      :config='"configs/pie_config_2.json"'
    ></piechart>
  </div>
</template>

<script>
import piechart from './components/PieChart'
import Legend from './components/Legend'

export default {
  name: 'app',
  components: {piechart, Legend}
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
