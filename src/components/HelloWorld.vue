<template>
  <!--<svg viewBox="0 0 600 600">-->

    <!--<line v-for="value in dataset"-->
          <!--:key = "value.territory"-->
          <!--stroke-width="1"-->
          <!--stroke="silver"-->
          <!--:x1 = "value.order * 70"-->
          <!--:y1 = "188"-->
          <!--:x2 = "value.order * 70"-->
          <!--:y2 = "182" />-->
    <!--<line v-for="i in 20"-->
          <!--:key = "i"-->
          <!--stroke-width="1"-->
          <!--stroke="silver"-->
          <!--:x1 = "47"-->
          <!--:y1 = "185 - i * 10"-->
          <!--:x2 = "53"-->
          <!--:y2 = "185 - i *10" />-->
    <!--<text v-for="value in dataset"-->
          <!--:key = "value.territory"-->
          <!--:x = "value.order * 70 - 20"-->
          <!--:y = "200"-->
          <!--:font-size = "6">-->
      <!--{{value.territory}}-->
    <!--</text>-->
    <!--<text v-for="i in 21"-->
          <!--:key = "i"-->
          <!--:x = "30"-->
          <!--:y = "185 - (i - 1) * 10 + 2"-->
          <!--:font-size = "6">-->
      <!--{{(i - 1) * 50}}-->
    <!--</text>-->
    <!--<circle v-for="value in dataset"-->
            <!--:key = "value.libraries"-->
            <!--fill="blue"-->
            <!--:r = "3"-->
            <!--:cx = "value.order * 70"-->
            <!--:cy = "185 - value.libraries / 5"/>-->

  <!--</svg>-->
  <div>
    <button v-on:click="getSql()">posgreSQL</button>
    <button v-on:click="getCsv()">csv</button>
    <button v-on:click="getXml()">xml</button>
    <svg viewBox="0 0 600 600">
      <!--<path v-if="postgreData" fill="none"-->
      <!--stroke="green"-->
      <!--stroke-width="1"-->
      <!--:d="line"/>-->
      <!--<circle v-for="value in postgreData"-->
      <!--:key = "value.x"-->
      <!--fill="blue"-->
      <!--:r = "3"-->
      <!--:cx = "value.y * zoom + 50"-->
      <!--:cy = "200 - value.x * zoom/4 + 15"/>-->
      <rect v-for="(value, index) in dataBase"
            :key = "iter + index"
            :fill = "randomColor"
            :x = "zoom * index + 50"
            :y = "200 - value.x * zoom/4"
            :width = "zoom - 1"
            :height = "value.x * zoom/4"/>
      <line stroke-width="1"
            stroke="silver"
            :x1 = "50"
            :y1 = "200"
            :x2 = "600"
            :y2 = "200" />
      <line stroke-width="1"
            stroke="silver"
            :x1 = "50"
            :y1 = "600/3"
            :x2 = "50"
            :y2 = "0" />
      <!--<line v-for="i in dataBase.length"-->
            <!--:key = "i"-->
            <!--stroke-width="1"-->
            <!--stroke="silver"-->
            <!--:x1 = "185 - ( i + 1 ) * (200) / dataBase.length"-->
            <!--:y1 = "200"-->
            <!--:x2 = "53"-->
            <!--:y2 = "200" />-->
    </svg>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import dataset from './dataset'
import '../../server/index.js'
import PostsService from '@/services/PostsService'
import config from '@/tsconfig.json'
var zoom
export default {
  data () {
    return {
      dataBase: [],
      zoom: 60,
      config,
      iter: 0
    }
  },
  computed: {
    lineGenerator () {
      return d3.line()
        .curve(d3.curveNatural)
        .x(v => v.y * zoom)
        .y(v => v.x * zoom / 4)
    },
    line () {
      return this.lineGenerator(this.dataset)
    },
    randomColor () {
      var letters = '0123456789ABCDEF'
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    }
  },
  methods: {
    async getSql () {
      this.iter += 8
      const response = await PostsService.fetchSQL()
      this.dataBase = response.data
    },
    async getCsv () {
      this.iter += 8
      const response = await PostsService.fetchCsv()
      this.dataBase = response.data
    },
    async getXml () {
      this.iter += 8
      const response = await PostsService.fetchXml()
      this.dataBase = []
      for (var i = 0; i < response.data.note.y.length; ++i) {
        var ob = {}
        ob['x'] = +response.data.note.x[i]._text
        ob['y'] = +response.data.note.y[i]._text
        this.dataBase.push(ob)
      }
    }
  },
  mounted () {
    this.getSql()
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
