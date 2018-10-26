<template>
  <svg viewBox="0 0 600 600">
    <path fill="none"
          stroke="green"
          stroke-width="1"
          :d="line"/>
    <line v-for="value in dataset"
          :key = "value.territory"
          stroke-width="1"
          stroke="silver"
          :x1 = "value.order * 70"
          :y1 = "188"
          :x2 = "value.order * 70"
          :y2 = "182" />
    <line v-for="i in 20"
          :key = "i"
          stroke-width="1"
          stroke="silver"
          :x1 = "47"
          :y1 = "185 - i * 10"
          :x2 = "53"
          :y2 = "185 - i *10" />
    <text v-for="value in dataset"
          :key = "value.territory"
          :x = "value.order * 70 - 20"
          :y = "200"
          :font-size = "6">
      {{value.territory}}
    </text>
    <text v-for="i in 21"
          :key = "i"
          :x = "30"
          :y = "185 - (i - 1) * 10 + 2"
          :font-size = "6">
      {{(i - 1) * 50}}
    </text>
    <circle v-for="value in dataset"
            :key = "value.libraries"
            fill="blue"
            :r = "3"
            :cx = "value.order * 70"
            :cy = "185 - value.libraries / 5"/>
    <line stroke-width="1"
          stroke="silver"
          :x1 = "50"
          :y1 = "185"
          :x2 = "580"
          :y2 = "185" />
    <line stroke-width="1"
          stroke="silver"
          :x1 = "50"
          :y1 = "185"
          :x2 = "50"
          :y2 = "0" />
  </svg>
</template>

<script>
import * as d3 from 'd3'
import dataset from './dataset'
import '../../server/index.js'

export default {
  data () {
    return {
      dataset
    }
  },
  computed: {
    lineGenerator () {
      return d3.line()
        .curve(d3.curveNatural)
        .x(v => v.order * 70)
        .y(v => 185 - v.libraries / 5)
    },
    line () {
      return this.lineGenerator(this.dataset)
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
