<template>
  <div id="app">
    <BarChart></BarChart>
     <!--<BarChart width_chart = 900></BarChart>-->
  </div>
</template>

<script>
import BarChart from './components/BarChart'

export default {
  name: 'App',
  components: {
    BarChart
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
