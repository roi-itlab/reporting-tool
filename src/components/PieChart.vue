<template>
    <div class='pieComponent'>
      <div class='pieChart'></div>
      <Legend v-if='legendReady' :props='props.legendConfig'></Legend>
    </div>
</template>

<script>
import PostsService from '@/services/PostsService';
import VueTypes from 'vue-types';
import * as d3 from 'd3';
import Legend from './Legend';

export default {
  name: 'piechart',
  components: {Legend},
  props: {
    props:
      VueTypes.shape({
        outerRadius: VueTypes.number, 
        innerRadius: VueTypes.number,
        arcPadding: VueTypes.number,
        grouping: VueTypes.bool, 
        groupingThreshold: VueTypes.number,
        displayLegend: VueTypes.bool,
        legendConfig: VueTypes.object,
        colorscheme: VueTypes.array,
        valueKey: VueTypes.string, 
        labelKey: VueTypes.string,
        serverConfig: VueTypes.string
      }).def({})
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
      const response = await PostsService.fetchQuery(this.props.serverConfig);
      return response;
    },
    updateData() {
      this.getQuery().then(response => {
        this.items = response.data[0];
        this.sectors[this.items.length] = {};
        
        if (!this.sum) {
          for (let i = 0; i < this.items.length; i++) {
            this.sum += Number(this.items[i][this.valueKey]);
          }
        }

        this.createSVG();
      })      
    },
    createSVG() {
      var text = "";
      var color = d3.scaleOrdinal(this.props.colorscheme);
      var width = this.props.outerRadius * 2 + this.props.arcPadding * 2;
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
        .innerRadius(this.props.innerRadius)
        .outerRadius(this.props.outerRadius);

      var pie = d3.pie()
        .value(d => d[this.props.valueKey])
        .sort(null);

      var path = g.selectAll('path')
        .data(pie(this.items))
        .enter()
        .each((sct, i) => {
          this.legendData.labels[i] = sct.data[this.props.labelKey];
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
            .text(`${sct.data[this.props.labelKey]}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '-1.2em');
      
          g.append("text")
            .attr("class", "value-text")
            .text(`${sct.data[this.props.valueKey]}`)
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
          var x = Math.sin(sct.midAngle) * this.props.arcPadding;
          var y = -Math.cos(sct.midAngle) * this.props.arcPadding;
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

      if (this.props.displayLegend) {
        this.props.legendConfig.legendDataColors = this.legendData.colors;
        this.props.legendConfig.legendDataLabels = this.legendData.labels;
        this.legendReady = true;
      }
    }
  },
  mounted() {
    this.updateData();
  }
}
</script>

<style scoped>

</style>
