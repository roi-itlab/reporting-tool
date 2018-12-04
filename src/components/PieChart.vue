<template>
    <div></div>
</template>

<script>
import PostsService from '@/services/PostsService';
import * as d3 from 'd3';

export default {
  name: 'pie-chart',
  props: {
    svgSize: Number, 
    donutRatio: Number, 
    grouping: Boolean, 
    groupingThreshold: Number, 
    valueKey: String, 
    labelKey: String
  },
  data () {
    return {
      sum: 0,
      items: [],
      labels: [],
      sectors: [],
      colors: [],
      svgViewBox: '-1 -1 2 2',
      svgStyle: 'transform: rotate(-0.25turn)'
    }
  },
  methods: {
    async getQuery() {
      const response = await PostsService.fetchQuery();
      return response;
    },
    updateData() {
      this.getQuery().then(response => {
        this.items = response.data[0];
        this.sectors[this.items.length] = {};
        
        if (!this.sum) {
          for (let i = 0; i < this.items.length; i++) {
            this.sum += Number(this.items[i][this.getValueKey]);
            this.labels[i] = this.items[i][this.getLabelKey];
            this.colors[i] = this.getRandomColor();
          }
        }

        this.createSVG();
      })
    },
    createSVG() {
      var text = "";

      var width = this.getSize;
      var height = this.getSize;

      var radius = Math.min(width, height) / 2;
      var thickness = 60;
      var color = d3.scaleOrdinal(d3.schemeSet1);

      var svg = d3.select(this.$el)
      .append('svg')
      .attr('class', 'pie')
      .attr('width', width)
      .attr('height', height);

      var g = svg.append('g')
      .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

      var arc = d3.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

      var pie = d3.pie()
      .value(d => d[this.getValueKey()])
      .sort(null);

      var path = g.selectAll('path')
      .data(pie(this.items))
      .enter()
      .append("g")
      .attr("id", (d, i) => "sector" + i)
      .on("mouseover", (d, i) => {
            let g = d3.select("#sector" + i)
              .style("cursor", "pointer")
              .style("fill", "black")
              .append("g")
              .attr("class", "text-group");
       
            g.append("text")
              .attr("class", "name-text")
              .text(`${d.data[this.getLabelKey()]}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '-1.2em');
        
            g.append("text")
              .attr("class", "value-text")
              .text(`${d.data[this.getValueKey()]}`)
              .attr('text-anchor', 'middle')
              .attr('dy', '.6em');
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("cursor", "none")  
              .style("fill", color(this._current))
              .select(".text-group").remove();
          })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d,i) => color(i))
        .attr('opacity', '1')
        .on("mouseover", function(d) {
            d3.select(this)     
              .style("cursor", "pointer")
              .attr("opacity", "0.7");
          })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("cursor", "none")  
              .attr("opacity", "1");
          })
        .each(function(d, i) { this._current = i; });

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);
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
    },
    getValueKey() {
      return this.valueKey;
    },
    getLabelKey() {
      return this.labelKey;
    }
  },
  created() {
    this.updateData();
  },
  computed: {
    getDonutRatio() {
      return this.donutRatio;
    },
    getSize() {
      return this.svgSize;
    },
    getGrouping() {
      return this.grouping;
    },
    getGroupingThreshold() {
      return this.groupingThreshold;
    },
    getItems() {
      return this.items;
    }
  }
}
</script>

<style scoped>

</style>
