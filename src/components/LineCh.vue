<template>
  <div>
    <button v-on:click="createSvg()">Query</button>
    <div id="lineChart"></div>
  </div>
</template>

<script>/* eslint-disable */
import PostsService from '@/services/PostsService'
import * as d3 from 'd3'
export default {
  props: ['width', 'height', 'axisXColor', 'axisYColor', 'axesDepth',
          'circlesFillColor', 'circlesStrokeColor', 'circlesRad',
          'circlesVis', 'lineType', 'lineColor', 'lineVis', 'lineDepth',
          'symbolXVis', 'symbolYVis', 'symbolXColor', 'symbolYColor',
          'symbolXSize', 'symbolYSize', 'margin', "strokeXColor",
          'strokeYColor', 'strokeXDepth', 'strokeYDepth', 'strokeXCount', 'strokeYCount',
          'areaColor', 'areaVis', 'gridX', 'gridY', 'gridColor', 'gridVis', 'areaOpacity', 'dataCount'],
  name: 'LineCh',
  data() {
    return {
      start: false,
      width_: this.width,
      height_:this.height,
      margin_:this.margin,
      axesDepth_: this.axesDepth,
      axisXColor_:this.axisXColor,
      axisYColor_: this.axisYColor,
      lineVis_: this.lineVis,
      lineColor_:this.lineColor,
      symbolXColor_: this.symbolXColor,
      symbolYColor_: this.symbolYColor,
      circlesRad_: this.circlesRad,
      circlesVis_: this.circlesVis,
      circlesFillColor_: this.circlesFillColor,
      circlesStrokeColor_: this.circlesStrokeColor,
      lineDepth_: this.lineDepth,
      strokeXColor_: this.strokeXColor,
      strokeYColor_: this.strokeYColor,
      strokeYDepth_: this.strokeYDepth,
      strokeXDepth_: this.strokeXDepth,
      symbolXSize_: this.symbolXSize,
      symbolYSize_: this.symbolYSize,
      strokeXCount_: this.strokeXCount,
      strokeYCount_: this.strokeYCount,
      areaColor_:this.areaColor,
      areaVis_:this.areaVis,
      gridX_: this.gridX,
      gridY_: this.gridY,
      gridColor_: this.gridColor,
      gridVis_: this.gridVis,
      areaOpacity_: this.areaOpacity,
      dataCount_: this.dataCount,
      dataset_: []
    }
  },
  created: function() {
    if (!this.margin_) this.margin_ = { "left": 50, "right": 50, "top": 50, "bottom": 50 }
    if (!this.width_) this.width_ = 600
    if (!this.height_) this.height_ = 220
    if (!this.symbolXColor_) this.symbolXColor_ = 'black'
    if (!this.symbolYColor_) this.symbolYColor_ = 'black'
    if (!this.circlesRad_) this.circlesRad_ = 5
    if (!this.circlesVis_) this.circlesVis_ = true
    if (!this.circlesStrokeColor_) this.circlesStrokeColor_ = 'white'
    if (!this.circlesFillColor_) this.circlesFillColor_ = 'blue'
    if (!this.lineVis_) this.lineVis_ = true
    if (!this.lineColor_) this.lineColor_ = 'lightskyblue'
    if (!this.axisXColor_) this.axisXColor_ = 'black'
    if (!this.axisYColor_) this.axisYColor_ = 'black'
    if (!this.lineDepth_) this.lineDepth_ = 2
    if (!this.axesDepth_) this.axesDepth_ = 2
    if (!this.strokeXColor_) this.strokeXColor_ = 'black'
    if (!this.strokeYColor_) this.strokeYColor_ = 'black'
    if (!this.strokeYDepth_) this.strokeYDepth_ = 1
    if (!this.strokeXDepth_) this.strokeXDepth_ = 1
    if (!this.symbolXSize_) this.symbolXSize_ = 10
    if (!this.symbolYSize_) this.symbolYSize_ = 10
    if (!this.strokeXCount_) this.strokeXCount_ = 10
    if (!this.strokeYCount_) this.strokeYCount_ = 10
    if (!this.areaColor_) this.areaColor_ = 'royalblue'
    if (!this.areaVis_) this.areaVis_ = true
    if (!this.gridY_) this.gridY_ = 20
    if (!this.gridX_) this.gridX_ = 20
    if (!this.gridColor_) this.gridColor_= 'lavender'
    if (!this.gridVis_) this.gridVis_= true
    if (!this.areaOpacity_) this.areaOpacity_ = 0.5
    if (!this.dataCount_) this.dataCount_ = 1

  },
  methods: {
    createSvg(){

      function make_x_gridlines(d) {
        return d3.axisBottom(xScale)
          .ticks(d)
      }

      function make_y_gridlines(d) {
        return d3.axisLeft(yScale)
          .ticks(d)
      }

      var xScale = d3.scaleLinear().domain([0, 20]).range([0, this.width_])
      var yScale = d3.scaleLinear().domain([0, 1]).range([this.height_, 0])

      var line = d3.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d.y); })
        .curve(d3.curveMonotoneX)

      var dataset = d3.range(21).map(function(d) { return {"y": d3.randomUniform(1)() } })
      var dataset2 = d3.range(21).map(function(d) { return {"y": d3.randomUniform(1)() } })

      var svg = d3.select('#lineChart').append('svg')
        .attr('width', this.width_ + this.margin_.left + this.margin_.right)
        .attr('height', this.height_ + this.margin_.top + this.margin_.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin_.left + ',' + this.margin_.top + ')')

      if (this.gridVis_) {
        svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + this.height_ + ")")
          .call(make_x_gridlines(this.gridX_)
            .tickSize(-this.height_)
            .tickFormat(""))

        svg.append("g")
          .attr("class", "grid")
          .call(make_y_gridlines(this.gridY_)
            .tickSize(-this.width_)
            .tickFormat("")
          )
      }

      if (this.areaVis_) {
        var area = d3.area()
          .x(function (d, i) {
            return xScale(i);
          })
          .y1(function (d) {
            return yScale(d.y);
          })
          .y0(this.height_)
          .curve(d3.curveMonotoneX)

          svg.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("fill", this.areaColor_)
            .attr("opacity", this.areaOpacity_)
            .attr("d", area)

        svg.append("path")
          .datum(dataset2)
          .attr("class", "area")
          .attr("fill", 'red')
          .attr("opacity", this.areaOpacity_)
          .attr("d", area)
      }

      if (this.lineVis_) {
        svg.append("path")
          .datum(dataset)
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke-width", this.lineDepth_)
          .attr("stroke", this.lineColor_)
          .attr("d", line)

        svg.append("path")
          .datum(dataset2)
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke-width", this.lineDepth_)
          .attr("stroke", 'red')
          .attr("d", line)
      }

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + this.height_ + ")")
        .call(d3.axisBottom(xScale))

      svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))

      if (this.circlesVis_){
        svg.selectAll(".dot")
          .data(dataset)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", function(d, i) { return xScale(i) })
          .attr("cy", function(d) { return yScale(d.y) })
          .attr("r", this.circlesRad_)
          .attr("fill", this.circlesFillColor_)
          .attr("stroke", this.circlesStrokeColor_)

        svg.selectAll(".dot2")
          .data(dataset2)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", function(d, i) { return xScale(i) })
          .attr("cy", function(d) { return yScale(d.y) })
          .attr("r", this.circlesRad_)
          .attr("fill", 'white')
          .attr("stroke", 'red')


      }

      // var focus = svg.append("g")
      //   .attr("class", "focus")
      //   .style("display", "none")
      //
      // focus.append("line")
      //   .attr("class", "x-hover-line")
      //   .attr("y1", 0)
      //   .attr("y2", this.height_)
      //
      // focus.append("line")
      //   .attr("class", "y-hover-line")
      //   .attr("x1", this.width_)
      //   .attr("x2", this.width_)
      //
      // focus.append("circle")
      //   .attr("r", 7.5);
      //
      // focus.append("text")
      //   .attr("x", 15)
      //   .attr("dy", ".31em");
      //
      // svg.append("rect")
      //   .attr("transform", "translate(" + this.margin_.left + "," + this.margin_.top + ")")
      //   .attr("class", "overlay")
      //   .attr("width", this.width_)
      //   .attr("height", this.height_)
      //   .on("mouseover", function() { focus.style("display", null); })
      //   .on("mouseout", function() { focus.style("display", "none"); })
      //   .on("mousemove", mousemove)
      //
      // function mousemove() {
      //   var x0 = xScale.invert(d3.mouse(this)[0]),
      //     i = bisectDate(dataset, x0, 1),
      //     d0 = dataset[i - 1],
      //     d1 = dataset[i],
      //     d = x0 - d0.y > d1.y - x0 ? d1 : d0;
      //   focus.attr("transform", "translate(" + xScale(d.y) + "," + yScale(d.y) + ")");
      //   focus.select("text").text(function () {
      //     return d.y;
      //   });
      //   focus.select(".x-hover-line").attr("y2", this.height_ - yScale(d.y));
      //   focus.select(".y-hover-line").attr("x2", this.width_ + this.width_);
      // }

      svg.select('.y-axis > path')
        .attr('stroke', this.axisYColor_)
        .attr('stroke-width', this.axesDepth_)

      svg.select('.x-axis > path')
        .attr('stroke', this.axisXColor_)
        .attr('stroke-width', this.axesDepth_)

      svg.selectAll('.x-axis > tick > line')
        .attr('stroke', this.strokeXColor_)
        .attr('stroke-width', this.strokeXDepth_)

      svg.selectAll('.y-axis > .tick > line')
        .attr('stroke', this.strokeYColor_)
        .attr('stroke-width', this.strokeYDepth_)

      svg.selectAll('.x-axis > .tick > text')
        .attr('fill', this.symbolXColor_)
        .attr('font-size', this.symbolXSize_)

      svg.selectAll('.y-axis > .tick > text')
        .attr('fill', this.symbolYColor_)
        .attr('font-size', this.symbolYSize_)

      svg.selectAll('.grid > .tick > line').attr("stroke", this.gridColor_)
    }
  },
}
</script>

<style scoped>

</style>
