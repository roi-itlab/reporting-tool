<template>
    <div>
      <button v-on:click="getQuery()">Query</button>
      <svg viewBox="0 0 600 600">
        <line id = "axis-x"
              v-if="x != 0"
              :stroke-width="getAxisStrokeWidth"
              :stroke="getAxisColor"
              :x1 = "margin"
              :y1 = "margin/2 + y"
              :x2 = "margin + x"
              :y2 = "margin/2 + y" />
        <line id = "axis-y"
              v-if="y != 0"
              :stroke-width="getAxisStrokeWidth"
              :stroke="getAxisColor"
              :x1 = "margin"
              :y1 = "margin/2"
              :x2 = "margin"
              :y2 = "margin/2 + y" />
        <line v-if="y != 0"
              v-for="(value, index) in data"
              :key = "iter + index"
              :stroke = "getAxisColor"
              :x1 = "margin - LineConfig.size.subStrokeWidth/2"
              :y1 = "margin/2 + yMaxLength - deltaY * ( index + 1 )"
              :x2 = "margin + LineConfig.size.subStrokeWidth/2"
              :y2 = "margin/2 + yMaxLength - deltaY * ( index + 1 )"/>
        <line v-if="x != 0"
              v-for="(value, index) in 10"
              :key = "iter + index"
              :stroke = "getAxisColor"
              :x1 = "margin + (deltaX * ( index + 1 ))"
              :y1 = "margin/2 + yMaxLength - LineConfig.size.subStrokeWidth/2"
              :x2 = "margin + (deltaX * ( index + 1 ))"
              :y2 = "margin/2 + yMaxLength + LineConfig.size.subStrokeWidth/2"/>
        <circle v-if="x != 0"
                v-for="(value, index) in data"
                :key = "iter + index"
                v-bind:fill="getCircleColor"
                :r = "getCircleRadius"
                :cx = "margin + ((xMaxLength - margin) / maxX) * (index + 1)"
                :cy = "(margin/2 + yMaxLength) - ((yMaxLength - margin) / maxY) * (value[LineConfig.filters.axisY])"/>
      </svg>
    </div>
</template>
<script>
/* eslint-disable */
import PostsService from '@/services/PostsService'
import LineConfig from '@/LineChart.json'
export default {
  data () {
    return {
      iter: 0,
      name: 'LineChart',
      x: 0,
      y: 0,
      svgSize: 600,
      margin: 50,
      xMaxLength: 500,
      yMaxLength: 200,
      deltaX: 0,
      deltaY: 0,
      data: [],
      maxX: 0,
      maxY: 0,
      LineConfig
    }
  },
  methods: {
    async getQuery() {
      const response = await PostsService.fetchQuery()
      this.x = this.xMaxLength;
      this.y = this.yMaxLength;
      this.deltaX = ( this.xMaxLength - this.xMaxLength / 10 ) / 10
      this.deltaY = ( this.yMaxLength - this.yMaxLength / 20 ) / 10
      this.iter += response.data[0].length
      this.data = response.data[0]
      this.maxY = response.data[0][0][LineConfig.filters.axisY]
      this.maxX = response.data[0][0][LineConfig.filters.axisX]
      for (var i in response.data[0]) {
        if (response.data[0][i][LineConfig.filters.axisY] > this.maxY)
          this.maxY = response.data[0][i][LineConfig.filters.axisY]
        if (response.data[0][i][LineConfig.filters.axisX] > this.maxX)
          this.maxX = response.data[0][i][LineConfig.filters.axisX]
      }

      console.log(this.maxX + " " + this.maxY)


    }
  },
  computed: {
    getAxisColor() {
      return LineConfig.colors.axis
    },
    getCircleColor() {
      return LineConfig.colors.circle
    },
    getCircleRadius() {
      return LineConfig.size.circleR
    },
    getAxisStrokeWidth() {
      return LineConfig.size.strokeWidth
    }
  }
}
</script>

<style scoped>

</style>
