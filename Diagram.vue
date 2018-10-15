<template>
  <svg width="500" height="300"></svg>
</template>

<script>
const d3 = require('d3');


export default {
  mounted: function() {
  /*  let map= d3.json("../static/data2.json",function(error,data){
      console.log(error);
    });*/
    let map= d3.json("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=microlensing&format=json",function(error,data){
        console.log(error);
      });
      console.log(map);
  map
   .then(data=>{toRunDraw(data);return data;})
   .then();
   .catch(()=>console.log('error'));

   const toRunDraw=(data)=>{
  let svg = d3.select('svg');
   let width = +svg.attr('width');
   let height = +svg.attr('height');
  svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class','rect')
      .attr('x',function(d){console.log(d); return 50;})
      .attr('y',50)
      .attr('width',300)
      .attr('height',100)
    }
    }
}
</script>

<style scoped>
  .rect{
     stroke: green;
  }
</style>
