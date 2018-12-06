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
        serverConfig: VueTypes.string.isRequired,
        labelKey: VueTypes.string.isRequired,
        valueKey: VueTypes.string.isRequired,
        outerRadius: VueTypes.number.isRequired,
        innerRadius: VueTypes.number,
        arcPadding: VueTypes.number,
        grouping: VueTypes.bool,
        groupingThreshold: VueTypes.number,
        colorscheme: VueTypes.array,
        displayLegend: VueTypes.bool,
        legendConfig: VueTypes.object
      }),
    innerRadius: VueTypes.number.def(0),
    arcPadding: VueTypes.number.def(0),
    grouping: VueTypes.bool.def(false),
    colorscheme: VueTypes.array.def(['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666']),
    displayLegend: VueTypes.bool.def(true),
    legendConfig: VueTypes.object.def({}),
  },
  data () {
    return {
      items: [],
      legendData: {
        labels: [],
        colors: []
      },
      legendReady: false
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
        this.createSVG();
      })      
    },
    createSVG() {
      let innerRadius = this.props.innerRadius || this.innerRadius;
      let arcPadding = this.props.arcPadding || this.arcPadding;
      let grouping = this.props.grouping || this.grouping;
      let colorscheme = this.props.colorscheme || this.colorscheme;
      let displayLegend = this.props.displayLegend || this.displayLegend;
      let legendConfig = this.props.legendConfig || this.legendConfig;

      let text = '';
      let color = d3.scaleOrdinal(colorscheme);
      let size = this.props.outerRadius * 2 + arcPadding * 2;

      let svg = d3.select('.pieChart')
        .append('svg')
        .attr('width', size)
        .attr('height', size);

      let g = svg.append('g')
        .attr(
          'transform', 
          'translate(' + (size / 2) + ',' + (size / 2) + ')'
        );

      let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(this.props.outerRadius);

      let pie = d3.pie()
        .value(d => d[this.props.valueKey])
        .sort(null);

      let path = g.selectAll('path')
        .data(pie(this.items))
        .enter()
        .each((sct, i) => {
          this.legendData.labels[i] = sct.data[this.props.labelKey];
          this.legendData.colors[i] = color(i);
        })
        .append('g')
        .attr('id', (sct, i) => 'sector' + i)
        .on('mouseover', (sct, i) => {
          let g = d3.select('#sector' + i)
            .style('cursor', 'pointer')
            .style('fill', 'black')
            .append('g')
            .attr('class', 'text-group');
     
          g.append('text')
            .attr('class', 'name-text')
            .text(`${sct.data[this.props.labelKey]}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '-1.2em');
      
          g.append('text')
            .attr('class', 'value-text')
            .text(`${sct.data[this.props.valueKey]}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.6em');
        })
        .on('mouseout', (sct, i, nodes) => {
          d3.select(nodes[i])
            .style('cursor', 'none')  
            .style('fill', this.legendData.colors[i])
            .select('.text-group').remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (sct, i) => this.legendData.colors[i])
        .attr('opacity', '1')
        .attr('transform', sct => {
          sct.midAngle = (sct.endAngle - sct.startAngle) / 2 
            + sct.startAngle;
          let x = Math.sin(sct.midAngle) * arcPadding;
          let y = -Math.cos(sct.midAngle) * arcPadding;
          return 'translate(' + x + ',' + y + ')';
        })
        .on('mouseover', (sct, i, nodes) => {
          d3.select(nodes[i])     
            .style('cursor', 'pointer')
            .attr('opacity', '0.7');
        })
        .on('mouseout', (sct, i, nodes) => {
          d3.select(nodes[i])
            .style('cursor', 'none')  
            .attr('opacity', '1');
        });

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(text);

      if (displayLegend) {
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
