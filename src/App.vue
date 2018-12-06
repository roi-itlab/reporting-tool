<template>
  <div id="app">
    <h1>Reporting Tool</h1>
    <piechart :props="pieConfig"></piechart>
  </div>
</template>

<script>
import piechart from './components/PieChart'
import Legend from './components/Legend'

export default {
  name: 'app',
  components: {piechart, Legend},
  data () {
    return {
      pieConfig: {
        serverConfig: "configs/pie_config_2.json",
        labelKey: "name",
        valueKey: "avg_spawns",
        outerRadius: 250,
        innerRadius: 0,
        arcPadding: 50,
        grouping: true,
        groupingThreshold: 5,
        colorscheme: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"],
        displayLegend: true,
        legendConfig: {
            borderVis: true,
            borderColor: 'blue',
            textColor: 'grey',
            textSize: 15,
            margin: 15,
            dataSignVis: true
        }
      }
    }
  }
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
.pieChart {
  display: inline-block;
  vertical-align: top;
}
.legend {
  display: inline-block;
}
</style>
