<template>
    <div class='pieComponent'>
      <div class='pieChart'></div>
      <Legend v-if='legendReady' :legendData='legendData'></Legend>
    </div>
</template>

<script>
import PostsService from '@/services/PostsService';
import * as d3 from 'd3';
import Legend from './Legend';

export default {
  name: 'piechart',
  components: {Legend},
  props: {
    outerRadius: Number, 
    innerRadius: Number,
    arcPadding: Number,
    grouping: Boolean, 
    groupingThreshold: Number,
    displayLegend: Boolean,
    colorscheme: Array,
    valueKey: String, 
    labelKey: String,
    config: String
  },
  data () {
    return {
      sum: 0,
      items: [],
      sectors: [],
      legendData: {
        labels: [],
        colors: []
      },
      legendReady: false,
      svgViewBox: '-1 -1 2 2',
      svgStyle: 'transform: rotate(-0.25turn)'
    }
  },
  methods: {
    async getQuery() {
      const response = await PostsService.fetchQuery(this.config);
      return response;
    },
    updateData() {
      this.getQuery().then(response => {
        this.items = response.data[0];
        this.sectors[this.items.length] = {};
        
        if (!this.sum) {
          for (let i = 0; i < this.items.length; i++) {
            this.sum += Number(this.items[i][this.getValueKey]);
            
          }
        }

        this.createSVG();
      })      
    },
    createSVG() {
      var text = "";
      var color = d3.scaleOrdinal(this.colorscheme);
      var width = this.getOuterRadius * 2 + this.getArcPadding * 2;
      var height = width;

      var svg = d3.select('.pieChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      var g = svg.append('g')
        .attr(
          'transform', 
          'translate(' + (width / 2) + ',' + (height / 2) + ')'
        );

      var arc = d3.arc()
        .innerRadius(this.getInnerRadius)
        .outerRadius(this.getOuterRadius);

      var pie = d3.pie()
        .value(d => d[this.getValueKey()])
        .sort(null);

      var path = g.selectAll('path')
        .data(pie(this.items))
        .enter()
        .each((sct, i) => {
          this.legendData.labels[i] = sct.data[this.getLabelKey()];
          this.legendData.colors[i] = color(i);
        })
        .append("g")
        .attr("id", (sct, i) => "sector" + i)
        .on("mouseover", (sct, i) => {
          let g = d3.select("#sector" + i)
            .style("cursor", "pointer")
            .style("fill", "black")
            .append("g")
            .attr("class", "text-group");
     
          g.append("text")
            .attr("class", "name-text")
            .text(`${sct.data[this.getLabelKey()]}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '-1.2em');
      
          g.append("text")
            .attr("class", "value-text")
            .text(`${sct.data[this.getValueKey()]}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.6em');
        })
        .on("mouseout", (sct, i, nodes) => {
          d3.select(nodes[i])
            .style("cursor", "none")  
            .style("fill", this.legendData.colors[i])
            .select(".text-group").remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (sct, i) => this.legendData.colors[i])
        .attr('opacity', '1')
        .attr('transform', sct => {
          sct.midAngle = (sct.endAngle - sct.startAngle) / 2 
            + sct.startAngle;
          var x = Math.sin(sct.midAngle) * this.getArcPadding;
          var y = -Math.cos(sct.midAngle) * this.getArcPadding;
          return 'translate(' + x + ',' + y + ')';
        })
        .on("mouseover", (sct, i, nodes) => {
          d3.select(nodes[i])     
            .style("cursor", "pointer")
            .attr("opacity", "0.7");
        })
        .on("mouseout", (sct, i, nodes) => {
          d3.select(nodes[i])
            .style("cursor", "none")  
            .attr("opacity", "1");
        });

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);

      if (this.displayLegend) {
        console.log('test')
        this.legendReady = true;
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
    getSectorColor(index) {
      return this.legendData.colors[index];
    },
    getValueKey() {
      return this.valueKey;
    },
    getLabelKey() {
      return this.labelKey;
    }
  },
  mounted() {
    this.updateData();
  },
  computed: {
    getOuterRadius() {
      return this.outerRadius;
    },
    getInnerRadius() {
      return this.innerRadius;
    },
    getArcPadding() {
      return this.arcPadding;
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
