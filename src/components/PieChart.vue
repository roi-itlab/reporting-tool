<template>
    <div>
      <button v-on:click="getQuery()">Query</button>
      <svg :height="getSize"
        viewBox="-1 -1 2 2" 
        style="transform: rotate(-0.25turn)">
        <defs>
          <mask id="hole">
            <circle r="1" cx="0" cy="0" fill="white"/>
            <circle :r="getDonutRatios" cx="0" cy="0" fill="black"/>
          </mask>
        </defs>
        <path mask="url(#hole)" 
          v-for = "(item, index) in items"
            :fill = "getSectorColor(index)"
            :d = "getSectorPath(item[PieConfig.keys.value], index)"/>
      </svg>
      <ul>
        <li v-for = "(value, index) in colors">
          {{labels[index] + " (" + sectors[index].pct + "%)"}}
          <svg width="15" height="15">
            <rect width="15" height="15" :fill="value"/>
          </svg>
        </li>
      </ul>
    </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import PieConfig from '@/PieChart.json'

export default {
  data () {
    return {
      sum: 0,
      items: [],
      labels: [],
      sectors: [],
      colors: [],
      PieConfig
    }
  },
  methods: {
    async getQuery() {
      const response = await PostsService.fetchQuery();
      this.items = response.data[0];
      this.sectors[this.items.length] = {};

      if (!this.sum) {
        for (let i = 0; i < this.items.length; i++) {
          this.sum += Number(this.items[i][PieConfig.keys.value]);
          this.labels[i] = this.items[i][PieConfig.keys.label];
          this.colors[i] = this.getRandomColor();
        }
      }
    },
    getRandomColor() {
      let color = ['#', 
        ['00000', 
          (Math.random() * (1 << 24) | 0).toString(16)
        ].join('').slice(-6)
      ].join('');
      
      while (color === "#ffffff") {
        color = ['#', 
          ['00000', 
            (Math.random() * (1 << 24) | 0).toString(16)
          ].join('').slice(-6)
        ].join('');
      }

      return color;
    },
    getSectorPath(value, index) {
      let pct = value/this.sum,
        pctAccumulated = pct,
        mX = 1,
        mY = 0;

      if (index > 0) {
        mX = this.sectors[index - 1].x;
        mY = this.sectors[index - 1].y;
        pctAccumulated += this.sectors[index - 1].pctAccumulated;
      }

      let M = [mX, " ", mY].join(''),
        largeArcFlag = pct > 0.5? 1 : 0,
        ax = Math.cos(2 * Math.PI * pctAccumulated),
        ay = Math.sin(2 * Math.PI * pctAccumulated),
        A = ['1 1 0 ', largeArcFlag, ' 1 ', ax, ' ', ay].join('');

      this.sectors[index] = {
        x: ax, 
        y: ay, 
        pct: (pct * 100).toFixed(2), 
        pctAccumulated: pctAccumulated
      };

      return ["M ", M, " A ", A, " L 0 0"].join('');
    },
    getSectorColor(index) {
      return this.colors[index];
    }
  },
  computed: {
    getDonutRatios() {
      return PieConfig.size.donutRatios;
    },
    getSize() {
      return PieConfig.size.svgSize;
    }
  }
}
</script>

<style scoped>

</style>
