<template>
    <div id="lineChart"></div>
</template>

<script>
import PostsService from '@/services/PostsService'
import * as d3 from 'd3'
import Legend from './Legend'
export default {
  components: {Legend},
  props: {
    backgroundColor: {
      default: 'Gainsboro',
      type: String
    },
    width: {
      default: 800,
      type: Number
    },
    height: {
      default: 300,
      type: Number
    },
    margin: {
      default: function () {
        return { left: 50, right: 50, top: 50, bottom: 50 }
      },
      type: Object
    },
    symbolXColor: {
      default: 'black',
      type: String
    },
    symbolYColor: {
      default: 'black',
      type: String
    },
    circlesRad: {
      default: 5,
      type: Number
    },
    circlesVis: {
      default: true,
      type: Boolean
    },
    circlesStrokeColor: {
      default: 'white',
      type: String
    },
    circlesFillColor: {
      //default: 'blue',
      default: function() {
        return ['green', 'red', 'yellow']
      },
      type: Array
    },
    lineVis: {
      default: true,
      type: Boolean
    },
    lineColor: {
      //default: 'lightskyblue',
      default: function() {
        return ['green', 'red', 'yellow']
      },
      type: Array
    },
    axisXColor: {
      default: 'black',
      type: String
    },
    axisYColor: {
      default: 'black',
      type: String
    },
    lineDepth: {
      default: 2,
      type: Number
    },
    axesDepth: {
      default: 2,
      type: Number
    },
    strokeXColor: {
      default: 'black',
      type: String
    },
    strokeYColor: {
      default: 'black',
      type: String
    },
    strokeYDepth: {
      default: 1,
      type: Number
    },
    strokeXDepth: {
      default: 1,
      type: Number
    },
    symbolXSize: {
      default: 10,
      type: Number
    },
    symbolYSize: {
      default: 10,
      type: Number
    },
    strokeXCount: {
      default: 10,
      type: Number
    },
    strokeYCount: {
      default: 10,
      type: Number
    },
    areaColor: {
      default: 'royalblue',
      type: String
    },
    areaVis: {
      default: false,
      type: Boolean
    },
    gridY: {
      default: 20,
      type: Number
    },
    gridX: {
      default: 20,
      type: Number
    },
    gridColor: {
      // default: 'lavender',
      default: 'grey',
      type: String
    },
    gridVis: {
      default: true,
      type: Boolean
    },
    areaOpacity: {
      default: 0.5,
      type: Number
    },
    dataCount: {
      default: 3,
      type: Number
    }
  },
  name: 'LineChart',
  mounted: function() {
    this.createSvg()
  },
  methods: {
    createSvg(){
      //function create X-grid
      function make_x_gridlines(d) {
        return d3.axisBottom(xScale)
          .ticks(d)
      }

      //function create Y-grid
      function make_y_gridlines(d) {
        return d3.axisLeft(yScale)
          .ticks(d)
      }

      let xScale
      let yScale
      let line
      let dataset = []
      let svg
      let area

      xScale = d3.scaleLinear().domain([0, 20]).range([0, this.width])
      yScale = d3.scaleLinear().domain([0, 1]).range([this.height, 0])

      //draw line
      line = d3.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d.y); })
        .curve(d3.curveMonotoneX)

      //draw area
      if (this.areaVis) {
        area = d3.area()
          .x(function (d, i) {
            return xScale(i);
          })
          .y1(function (d) {
            return yScale(d.y);
          })
          .y0(this.height)
          .curve(d3.curveMonotoneX)
      }

      for (let i = 0; i < this.dataCount; ++i)
        dataset.push( d3.range(21).map(function(d) { return {"y": d3.randomUniform(1)() } }) )

      svg = d3.select('#lineChart').append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')


      svg.append('rect').attr('class', 'bg')
        .attr('height', this.height)
        .attr('width', this.width)
        .attr('fill-opacity', 0.5)
        .attr('fill', this.backgroundColor)
        .attr("transform", () => {
          return "translate(" + this.borderWidth + "," + this.borderWidth + ")"
        })
        .attr('stroke-width', this.borderWidth).attr('rx', 5).attr('ry', 5)


      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(xScale))

      svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))

      //draw grid
      if (this.gridVis) {
        svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + this.height + ")")
          .call(make_x_gridlines(this.gridX)
            .tickSize(-this.height)
            .tickFormat(""))

        svg.append("g")
          .attr("class", "grid")
          .call(make_y_gridlines(this.gridY)
            .tickSize(-this.width)
            .tickFormat("")
          )
      }

      for (let i = 0; i < this.dataCount; ++i){
        if (this.areaVis) {
          svg.append("path")
            .datum(dataset[i])
            .attr("class", "area" + i)
            .attr("fill", this.areaColor)
            .attr("opacity", this.areaOpacity)
            .attr("d", area)
        }
        if (this.lineVis) {
          svg.append("path")
            .datum(dataset[i])
            .attr("class", "line" + i)
            .attr("fill", "none")
            .attr("stroke-width", this.lineDepth)
            .attr("stroke", this.lineColor[i])
            .attr("d", line)
        }
        if (this.circlesVis){
          svg.selectAll(".dot" + i)
            .data(dataset[i])
            .enter().append("circle")
            .attr("class", "dot" + i)
            .attr("cx", function(d, i) { return xScale(i) })
            .attr("cy", function(d) { return yScale(d.y) })
            .attr("r", this.circlesRad)
            .attr("fill", this.circlesFillColor[i])
            .attr("stroke", this.circlesStrokeColor)
            .on('mouseover', function () { this.setAttribute('r', +this.getAttribute('r') + 2)})
            .on('mouseout', function () { this.setAttribute('r', +this.getAttribute('r') - 2)})
        }
      }

      svg.select('.y-axis > path')
        .attr('stroke', this.axisYColor)
        .attr('stroke-width', this.axesDepth)

      svg.select('.x-axis > path')
        .attr('stroke', this.axisXColor)
        .attr('stroke-width', this.axesDepth)

      svg.selectAll('.x-axis > tick > line')
        .attr('stroke', this.strokeXColor)
        .attr('stroke-width', this.strokeXDepth)

      svg.selectAll('.y-axis > .tick > line')
        .attr('stroke', this.strokeYColor)
        .attr('stroke-width', this.strokeYDepth)

      svg.selectAll('.x-axis > .tick > text')
        .attr('fill', this.symbolXColor)
        .attr('font-size', this.symbolXSize)

      svg.selectAll('.y-axis > .tick > text')
        .attr('fill', this.symbolYColor)
        .attr('font-size', this.symbolYSize)

      svg.selectAll('.grid > .tick > line').attr("stroke", this.gridColor)
    }
  },
}
</script>
