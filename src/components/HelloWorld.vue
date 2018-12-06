<template>
  <div>
    <Legend v-bind:props="classMishaLegendExample"></Legend>
    <LineChart v-bind:props="classMishaLineChartExample"></LineChart>
  </div>

</template>
<script>
import LineChart from './LineChart'
import Legend from './Legend'
export default {
  components: {LineChart, Legend},
  data: function () {
    return {
      classMishaLegendExample: {
        borderVis: true,
        borderColor: 'blue',
        textColor: 'grey',
        textSize: 15,
        margin: 15,
        dataSignVis: true,
        legendDataLabels: ['низкая температура', 'высокая температура'],
        legendDataColors: ['blue', 'red']
       },
      classMishaLineChartExample: {
        width: 800,
        height: 400,
        dataXPath: "month",
        lineVis: true,
        dataYPath: ["temp_lo", 'temp_hi'],
        dataCount: 2,
        linesColor: ["blue", "red"],
        gridVis : true,
        circlesVis : true,
        circlesFillColor: ['RoyalBlue', 'LightSalmon'],
        circlesStrokeColor: ['white', 'white'],
        areaVis: true,
        gridX: 10,
        gridY: 35,
        areaColor: ['blue', 'red'],
        areaOpacity: 0.2,
        gridColor: 'Gainsboro'
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
