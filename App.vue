<template>
  <div id="app">
    <BarChart></BarChart>
     <!--<BarChart width_chart = 900 height_chart=500 width_bar=3.45></BarChart>-->
      <!--ни к чему не привязан - плохой -->
     <!-- <GroupedBarChart2></GroupedBarChart2>-->
      <!--хороший-->
       <GroupedBarChart></GroupedBarChart>
     <StackedBarChart></StackedBarChart>
  </div>
</template>

<script>
import BarChart from './components/BarChart'
import GroupedBarChart from './components/GroupedBarChart'
import GroupedBarChart2 from './components/GroupedBarChart2'
import StackedBarChart from './components/StackedBarChart'
export default {
  name: 'App',
  components: {
    BarChart,
    GroupedBarChart,
    GroupedBarChart2,
    StackedBarChart

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
</style>
