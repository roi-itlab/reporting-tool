<template>
<div>
<svg width="960" height="500" class="stackedBar"></svg>
</div>
</template>
<script>
import Legend from './Legend'
import * as d3 from 'd3'
import VueTypes from 'vue-types';
import Vue from 'vue';
export default {
  name: 'StackedBarChart',
data: function(){
  return {
    legendData: {
      name_legend : [],
      color_legend :[]
      },
    legendReady: false,
    dataSignVis: false
  }
},
 mounted: function(){
     var svg = d3.select(".stackedBar"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"]);



     let map= d3.json("http://localhost:5003/api/posts",function(error,data){
        console.log(error);
      });
      console.log(map);
    map
    .then(data=>{toRunDraw(data);return data;})
    .then();
  const toRunDraw=(data)=>{
      console.log(data);
    
  var columns = d3.keys(data[0]);
  var keys = columns.slice(2);
//delete count (last elemetn of array, so it's not use in legend and bars)
  keys.pop();


   data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d,i) { return i; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d,i) { return x(i); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(function(d,i) { return data[i].State}));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });


  }
 }
}
</script>