<template>
  <div>
      <label for=""> The x-axis</label>
    <select v-model='draw.currentX'>
      <option v-for="parameter in drawsKeys" >{{parameter}}</option>
    </select>
    <br>
    <label for=""> The y-axis</label>
  <select v-model='draw.currentY' @blur="moveDate">
    <option v-for="parameter in drawsKeys" >{{parameter}}</option>
  </select>
  <br>
  <br>
  <br>
  <button class="btn" @click="showDiagram">showDiagram</button>
  <br>
  <br>
  <svg width="500" height="300"></svg>
  </div>
</template>

<script>
import {bus} from '../main.js';
const d3 = require('d3');


export default {
  data(){
    return{
      draw:{
        currentX:'',
        currentY:''
      },
      drawsKeys:[],
      objData:[]
    }
  },
  created:function(){
  /*  let map= d3.json("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=microlensing&format=json",function(error,data){
        console.log(error);
      });*/
      let url="https://data.cityofnewyork.us/api/views/kku6-nxdu/rows.json?accessType=DOWNLOAD";
      let urlOne="https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=microlensing&format=json";
      let map= d3.json(urlOne,function(error,data){
          console.log(error);
        });
      map
        .then(data=>{this.drawsKeys= Object.keys(data[0]);
            return data;})
        .then(data=>{
          this.objData=data;return data;})
         .catch(()=>console.log('error'));
  },
  mounted(){


},
methods:{
  moveDate:function(){
  this.draw;
    bus.$emit('passDate', [this.draw,this.objData]);
  },
  showDiagram: function(){
    const w = 500; const	h = 300; const padding = 20;
    if(d3.select("svg")) d3.select("svg").remove();
    var svg = d3.select("body").append("svg")
    .attr("width", w)
  .attr("height", h);



  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
    }
    //  console.log(this.objData);
      //  console.log(this.draw.currentX);
        let x = this.draw.currentX;
        let y = this.draw.currentY;
  let linearX = d3.scaleLinear()
          .domain([0, getMaxOfArray(this.objData.map(function(curr){ return curr[x]}))+2])
          .range([padding,w-padding]);
  let linearY = d3.scaleLinear()
          .domain([0, getMaxOfArray(this.objData.map(function(curr){return curr[y]}))+2])
          .range([h-padding,padding]);
        //  console.log(linearY);

  svg.selectAll(".node")
    .data(this.objData)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("cx", d=> linearX(d[x]))
    .attr("cy", d=> linearY(d[y]))
    .attr("r","2");


    var xAxis = d3.axisBottom()
      .scale(linearX);
    var yAxis = d3.axisLeft()
      .scale(linearY);

  svg.append('g')
      .attr("transform", "translate("+padding + "," + (h - padding) + ")")
      .call(xAxis);

  svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding*2 + ",0)")
      .call(yAxis);

  svg.append("text")
      .attr("x",padding + 11)
      .attr("y", padding - 11)
      .attr("text-anchor", "end")
      .style("font-size", "11px")
      .text("Ось Y");
  svg.append("text")
      .attr("x", w- padding + 11)
      .attr("y", h - padding - 5)
      .attr("text-anchor", "end")
      .style("font-size", "11px")
      .text("Ось Х");
  }
}

}
</script>

<style scoped>
*{
margin:0;
padding:0;
border:0;
box-sizing:border-box;
}
.link {
stroke: rgb(93, 15, 238);
stroke-width: 1.5px;
}

.node {
fill: rgb(5, 250, 79);
stroke: rgb(10, 10, 10);
stroke-width: 1.5px;
}
.text{
font-family:sans-serif;
font-size: 16px;
fill:black;
}
.btn{
  padding:10px;
  border-radius: 10px;
  border:1px solid red;
}

</style>
