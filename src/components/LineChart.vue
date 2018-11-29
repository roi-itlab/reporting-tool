<template>
    <div>
      <button v-on:click="getQuery()">Query</button>
      <svg viewBox="0 0 600 600">
        <line id = "axis-x"
              v-if="x != 0"
              :stroke-width="getAxisWidth"
              :stroke="getAxisColor"
              :x1 = "margin - getAxisWidth/2"
              :y1 = "margin/2 + y"
              :x2 = "margin + x + getAxisWidth/2"
              :y2 = "margin/2 + y" />
        <line id = "axis-y"
              v-if="y != 0"
              :stroke-width="getAxisWidth"
              :stroke="getAxisColor"
              :x1 = "margin"
              :y1 = "margin/2"
              :x2 = "margin"
              :y2 = "margin/2 + y" />
        <line v-if="x != 0 && getDashesVisible"
              v-for="(value, index) in getDashesCountX"
              :key = "iter + index"
              :stroke-width="getDashesWidth"
              :stroke = "getDashesColor"
              :x1 = "margin + ( index + 1 ) * deltaX"
              :y1 = "margin/2 + y - getDashesHeight"
              :x2 = "margin + ( index + 1 ) * deltaX"
              :y2 = "margin/2 + y + getDashesHeight"/>
        <line v-if="y != 0 && getDashesVisible"
              v-for="(value, index) in getDashesCountY"
              :key = "iter + index"
              :stroke-width="getDashesWidth"
              :stroke = "getDashesColor"
              :x1 = "margin - getDashesHeight"
              :y1 = "margin/2 + y - ( index + 1 ) * deltaY"
              :x2 = "margin + getDashesHeight"
              :y2 = "margin/2 + y -( index + 1 ) * deltaY"/>
        <text v-if="x != 0 && getSymbolXVisible"
              v-for="(value, index) in getDashesCountX"
              :key = "iter + index"
              :font-size = "getSymbolXSize"
              v-bind:fill="getSymbolXColor"
              :x = "margin + ( index + 1 ) * deltaX"
              :y = "margin/2 + y + getSymbolXSize + getDashesHeight + 1"
              text-anchor="middle"
        > {{ (maxX / getDashesCountX * ( index + 1 )).toFixed(1) }} </text>
        <text v-if="y != 0 && getSymbolYVisible"
              v-for="(value, index) in getDashesCountY"
              :key = "iter + index"
              :font-size = "getSymbolYSize"
              v-bind:fill="getSymbolYColor"
              :x = "margin - getSymbolYSize - getDashesHeight - 1"
              :y = "margin/2 + y - ( index + 1 ) * deltaY + getSymbolYSize/3"
              text-anchor="middle"
        > {{ (maxY / getDashesCountY * ( index + 1 )).toFixed(1) }} </text>
        <path v-if="getLineVisible"
        fill="none"
        :stroke="getLineColor"
        :stroke-width = "getLineWidth"
        :d="line"/>
        <circle v-if="x != 0 && getCircleVisible"
                v-for="(value, index) in data"
                :key = "iter + index"
                v-bind:fill="getCircleColor"
                :r = "getCircleRadius"
                :cx = "margin + ( ( x - margin) / maxX) * (value[LineConfig.filters.axisX])"
                :cy = "(margin/2 + y) - ( (y - deltaY) / maxY) * (value[LineConfig.filters.axisY])"/>
      </svg>
    </div>
</template>
<script>
/* eslint-disable */
import PostsService from '@/services/PostsService'
import LineConfig from '@/LineChart.json'
import * as d3 from 'd3'
export default {
  props: ['www'],
  data () {
    return {
      eee: this.www,
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
      this.deltaX = ( this.xMaxLength / ( LineConfig.dashes.countX + 1 ) )
      this.deltaY = ( this.yMaxLength / ( LineConfig.dashes.countY + 1 ) )
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
      return LineConfig.axis.color
    },
    getAxisWidth() {
      console.log(this.eee)
      console.log(this.eee)
      return LineConfig.axis.width
    },
    getCircleColor() {
      return LineConfig.circle.color
    },
    getCircleRadius() {
      return LineConfig.circle.radius
    },
    getCircleVisible() {
      return LineConfig.circle.visible
    },
    getDashesCountX() {
      return LineConfig.dashes.countX
    },
    getDashesCountY() {
      return LineConfig.dashes.countY
    },
    getDashesWidth() {
      return LineConfig.dashes.width
    },
    getDashesHeight() {
      return LineConfig.dashes.height
    },
    getDashesColor() {
      return LineConfig.dashes.color
    },
    getDashesVisible() {
      return LineConfig.dashes.visible
    },
    getLineVisible() {
      return LineConfig.line.visible
    },
    getLineType() {
      return LineConfig.line.type
    },
    getLineColor() {
      return LineConfig.line.color
    },
    getLineWidth() {
      return LineConfig.line.width
    },
    getSymbolXVisible() {
      return LineConfig.symbolX.visible
    },
    getSymbolXSize() {
      return LineConfig.symbolX.size
    },
    getSymbolXColor() {
      return LineConfig.symbolX.color
    },
    getSymbolYVisible() {
      return LineConfig.symbolY.visible
    },
    getSymbolYSize() {
      return LineConfig.symbolY.size
    },
    getSymbolYColor() {
      return LineConfig.symbolY.color
    },
    lineGenerator () {
       return d3.line()
         .curve(d3.curveNatural)
        .x(v => this.margin + ( ( this.x - this.margin) / this.maxX) * (v[LineConfig.filters.axisX]))
        .y(v => (this.margin/2 + this.y) - ( (this.y - this.deltaY) / this.maxY) * (v[LineConfig.filters.axisY]))
    },
    line () {
      return this.lineGenerator(this.data)
    }
  }
}
</script>

<style scoped>

</style>
