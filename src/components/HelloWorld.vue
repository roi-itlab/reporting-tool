<template>
  <LineCh
  v-bind:circlesRad="3"></LineCh>
</template>
<script>
/* eslint-disable no-unused-vars */
/* eslint-disable */
import * as d3 from 'd3'
import PostsService from '@/services/PostsService'
import LineCh from './LineCh'
var zoom
export default {
  components: {LineCh},
  data () {
    return {
      dataBase: [],
      zoom: 60,
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
