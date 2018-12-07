<template>
  <div>
    <!-- <Legend v-if='legendReady' :props='props.legendConfig'></Legend>-->
  </div>
</template>

<script>
import Legend from './Legend'
import * as d3 from 'd3'
import VueTypes from 'vue-types';
import Vue from 'vue';
export default {
  name: 'BarChart',
  components: {Legend},
  props: {
    props: VueTypes.shape({
      width_chart: VueTypes.number,
      height_chart: VueTypes.number,
      margin: VueTypes.number,
      color_chart: VueTypes.string,
      thickness_axis_y: VueTypes.number,
      color_axis_y: VueTypes.string,
      thickness_ticks_y: VueTypes.number,
      color_ticks_y: VueTypes.string,
      thickness_axis_x: VueTypes.number,
      color_axis_x: VueTypes.string,
      thickness_ticks_x: VueTypes.number,
      color_ticks_x: VueTypes.string,
      grafics_name: VueTypes.string,
      size_grafics_name: VueTypes.string,
      axis_y_name: VueTypes.string,
      size_axis_y_name: VueTypes.string,
      axis_x_name: VueTypes.string,
      size_axis_x_name: VueTypes.string,
      distance_between_grid_lines: VueTypes.number,
      color_vertical_lines_grid: VueTypes.string,
      color_horizontal_lines_grid: VueTypes.string,
      color_bar: VueTypes.string,
      width_bar: VueTypes.number,
      padding_of_labels: VueTypes.number,
      displayLegend: VueTypes.bool,
      legendConfig: VueTypes.object
    }).def({}),

    width_chart: VueTypes.number.def(1100),
    height_chart: VueTypes.number.def(600),
    margin: VueTypes.number.def(30),
    color_chart: VueTypes.string.def("#E3F2FD"),
    thickness_axis_y: VueTypes.number.def(1),
    color_axis_y: VueTypes.string.def("currentColor"),
    thickness_ticks_y: VueTypes.number.def(0),
    color_ticks_y: VueTypes.string.def("currentColor"),
    thickness_axis_x: VueTypes.number.def(1),
    color_axis_x: VueTypes.string.def("currentColor"),
    thickness_ticks_x: VueTypes.number.def(0),
    color_ticks_x: VueTypes.string.def("currentColor"),
    grafics_name: VueTypes.string.def("Crimes in Nothgate for 2014"),
    size_grafics_name: VueTypes.string.def("22px"),
    axis_y_name: VueTypes.string.def("Count of crimes"),
    size_axis_y_name: VueTypes.string.def("11px"),
    axis_x_name: VueTypes.string.def("Type of crime"),
    size_axis_x_name: VueTypes.string.def("11px"),
    distance_between_grid_lines: VueTypes.number.def(20),
    color_vertical_lines_grid: VueTypes.string.def("#6789ab"),
    color_horizontal_lines_grid: VueTypes.string.def("#6789ab"),
    color_bar: VueTypes.string.def("green"),
    width_bar: VueTypes.number.def(4),
    padding_of_labels: VueTypes.number.def(50),
    displayLegend: VueTypes.bool.def(true),
    legendConfig: VueTypes.object.def({})
},
data: function(){
  return {
    legendData: {
      name_legend : [],
      color_legend :[]
      },
    legendReady: false
  }
},
 mounted: function(){
   let chartWidthRect = this.props.width_chart || this.width_chart;
   let chartHeightRect  = this.props.height_chart || this.height_chart;
   let margin=this.props.margin || this.margin;
   let color_chart = this.props.color_chart || this.color_chart;
   let thickness_axis_y = this.props.thickness_axis_y || this.thickness_axis_y;
   let color_axis_y = this.props.color_axis_y || this.color_axis_y;
   let thickness_ticks_y = this.props.thickness_ticks_y || this.thickness_ticks_y;
   let color_ticks_y = this.props.color_ticks_y || this.color_ticks_y;
   let thickness_axis_x = this.props.thickness_axis_x || this.thickness_axis_x;
   let color_axis_x = this.props.color_axis_x || this.color_axis_x;
   let thickness_ticks_x = this.props.thickness_ticks_x || this.thickness_ticks_x;
   let color_ticks_x = this.props.color_ticks_x || this.color_ticks_x;
   let grafics_name = this.props.grafics_name || this.grafics_name;
   let size_grafics_name = this.props.size_grafics_name || this.size_grafics_name;
   let axis_y_name  = this.props.axis_y_name || this.axis_y_name;
   let size_axis_y_name = this.props.size_axis_y_name || this.size_axis_y_name;
   let axis_x_name = this.props.axis_x_name || this.axis_x_name;
   let size_axis_x_name = this.props.size_axis_x_name || this.size_axis_x_name;
   let distance_between_grid_lines = this.props.distance_between_grid_lines || this.distance_between_grid_lines;
   let color_vertical_lines_grid = this.props.color_vertical_lines_grid || this.color_vertical_lines_grid;
   let color_horizontal_lines_grid = this.props.color_horizontal_lines_grid || this.color_horizontal_lines_grid;
   let color_bar = this.props.color_bar || this.color_bar;
   let width_bar = this.props.width_bar || this.width_bar;
   let padding_of_labels = this.props.padding_of_labels || this.padding_of_labels;
   let legendConfig = this.props.legendConfig || this.legendConfig;
   let displayLegend = this.props.displayLegend;
   
   if (displayLegend === undefined || displayLegend === null) {
        displayLegend = this.displayLegend;
  }
  
   let chartWidth;
   let chartHeight;
   this.legendData.name_legend = ["Crimes 2014","Crimes 2015"];
   this.legendData.color_legend = ["#4CBB17", "green"];
   /*this.props.legendConfig.legendDataColors = this.legendData.color_legend;
   this.props.legendConfig.legendDataLabels = this.legendData.name_legend;
   this.legendReady = true;*/
   /*if (displayLegend) {
        
    }*/
   let map= d3.json("http://localhost:5000/api/posts",function(error,data){
        console.log(error);
      });
	map
    .then(data=>{toRunDraw(data);return data;})
    .then();
	const toRunDraw=(data)=>{
		var dataset = data.map(function(d) {return d.score;});
		var crimesdata = [{"name":"DUI-LIQUOR","score":9919},{"name":"CHILD-OTHER","score":2385},
		{"name":"SEXOFF-OTHER","score":1502},{"name":"BURGLARY-FORCE-RES","score":15909},
		{"name":"THEFT-CARPROWL","score":12104},{"name":"SEXOFF-SODOMY","score":2105}];
		var dataset2 = crimesdata.map(function(d) {return d.score;});
		var nameset  = data.map(function(d) {return d.name;});

		chartWidth= chartWidthRect-100;
		chartHeight=  chartHeightRect - 100;

		var xAxisLength = chartWidth - 2 * margin;   
		var yAxisLength = chartHeight - 2 * margin;

		var xScale = d3.scaleBand()
		  .range([0, chartWidth])
		  .domain(nameset);  

		var yScale = d3.scaleLinear()
			.domain([   
					d3.min(data, function(d) { return d.score - 10; }),
					d3.max(data, function(d) { return d.score + 10; })
			]).range([chartHeight, 0]);

		var heightScalingFactor = chartHeight / getMax(dataset);

		var substr = d3.select("div")
		  .append('svg')
		  .attr('width', chartWidthRect)
		  .attr('height', chartHeightRect)
		  .attr('class',"axis")
		  .style('background', color_chart);

		var xAxis = d3.axisBottom()
			.scale(xScale)
			 
		var yAxis = d3.axisLeft()
			.scale(yScale)

		substr.append("g")       
			.attr("class", "y-axis")
			.attr("transform",
					"translate(" + 1.5*margin + "," + 0.05 + ")")        
			.attr("stroke-width", thickness_ticks_y)
			.attr("stroke", color_ticks_y)
			.call(yAxis);

		 
		d3.selectAll('.axis path')
		  .style("stroke", color_axis_y)
		  .attr("stroke-width", thickness_axis_y);
		  
		substr.append("g")       
			.attr("class", "x-axis")
			.attr("transform",
				"translate(" + 1.5*margin + "," + (chartHeight-0.05*margin) + ")")      
			.attr("stroke-width", thickness_ticks_x)
			.attr("stroke", color_ticks_x)
			.call(xAxis);

		d3.selectAll('.axis path')
		  .style("stroke", color_axis_x)
		  .attr("stroke-width", thickness_axis_x);


		substr.append("text")
			.attr("x", (chartWidthRect / 2))
			.attr("y", chartHeightRect - 10 )
			.attr("text-anchor", "middle")
			.style("font-size", size_grafics_name)
			.text(grafics_name);


		substr.append("text")
			.attr("x", chartWidthRect-chartWidth+margin)
			.attr("y", chartHeightRect-chartHeight-2.5*margin)
			.attr("text-anchor", "end")
			.style("font-size", size_axis_y_name)
			.text(axis_y_name);
		
		substr.append("text")
			.attr("x", chartWidthRect - 0.5*margin)
			.attr("y", chartHeightRect - 2.5*margin)
			.attr("text-anchor", "end")
			.style("font-size", size_axis_x_name)
			.text(axis_x_name);

		let dbgl = distance_between_grid_lines;
		
		substr.selectAll(".vline").data(d3.range((chartWidth/dbgl)+1)).enter()
			.append("line")
			.attr("x1", function (d) {
			return 1.5*margin + d * dbgl;
		})
			.attr("x2", function (d) {
			return 1.5*margin + d * dbgl;
		})
			.attr("y1", function (d) {
			return 0;
		})
			.attr("y2", function (d) {
			return chartHeight;
		})
			.style("stroke", color_vertical_lines_grid);

		substr.selectAll(".vline").data(d3.range(chartHeight/dbgl)).enter()
			.append("line")
			.attr("y1", function (d) {
			return d * dbgl;
		})
			.attr("y2", function (d) {
			return d * dbgl;
		})
			.attr("x1", function (d) {
			return 1.5*margin;
		})
			.attr("x2", function (d) {
			return chartWidth + 1.5*margin;
		})
			.style("stroke", color_horizontal_lines_grid);


		var crimename  = ["Crimes 2014","Crimes 2015"];
		var colcr = d3.scaleOrdinal()
		.domain(["1450"])
		.range(["#4CBB17", "green"]);
		var legend = substr.append("g")
		  .attr("font-family", "sans-serif")
		  .attr("font-size", 10)
		  .attr("text-anchor", "end")
		.selectAll("g")
		.data(crimename)
		.enter().append("g")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
		  .attr("x", chartWidthRect - 19)
		  .attr("width", 19)
		  .attr("y",chartHeightRect-1.9*margin)
		  .attr("height", 19)
		  .attr("fill", colcr);

	  legend.append("text")
		  .attr("x", chartWidthRect - 24)
		  .attr("y", chartHeightRect - 1.5*margin)
		  .attr("dy", "0.32em")
		  .text(function(d) { return d; });    


		substr.append("g")
		  .attr("transform",  "translate(" + margin + ", 0)")
		  .selectAll(".bar")
		  .data(dataset)
		  .enter().append("rect")
		  .attr("class", "bar")
		  .on("click", onMouseOver) 
		  .attr('x', function (value, index) {                   
				return (index * (chartWidth / dataset.length)) + 2*margin
			  })
		  .attr('width', (chartWidth / dataset.length) - width_bar*margin) 
		  .attr('y', function (value, index) {                    
			return chartHeight   - (value * heightScalingFactor*0.9)
		  })
		  .transition()
		  .ease(d3.easeLinear)
		  .duration(400)
		  .delay(function (d, i) {
				 return i * 50;
			 })		  
		  .attr('height', function (value, index) {              
			return (value * heightScalingFactor*0.9)
		  })
		  .attr('fill', color_bar);


		let pol = padding_of_labels;
		substr.selectAll("text.bar")
			.data(dataset)
			.enter().append("text")
			.attr("class", "bar")
			.attr("text-anchor", "middle")
			.attr("x", function (value, index) {                   
					return (index * (chartWidth / dataset.length)) + 3.8*margin
				  })
			.attr("y", function (value, index) {                    
				return chartHeight   - (value * heightScalingFactor) + pol
			  })
			.text(function (value, index) {              
				return (value)});

		substr.append("g")
			.attr("transform",  "translate(" + margin + ", 0)")
			.selectAll(".bar")
			.data(dataset2)
			.enter().append("rect")
			.attr("class", "bar")
			.attr('x', function (value, index) {                   
				return (index * (chartWidth / dataset2.length)) +margin
			  })
			.attr('width', (chartWidth / dataset2.length) - 4.5*margin) 
			.attr('y', function (value, index) {                    
			return chartHeight   - (value * heightScalingFactor*0.9)
		  })
		    .attr('height', function (value, index) {              
			return (value * heightScalingFactor*0.9)
		  })
			.attr('fill', '#4CBB17');

	   
		function getMax(collection) {
			var max = 0
			collection.forEach(function (element) {
				max = element > max ? element : max
			})
				return max
		  }


		function onMouseOver(d, i) {
			d3.select(this).attr('class', 'bar');
			d3.select(this)
				.transition()     // adds animation
				.duration(400)
				.attr('width', (chartWidth / dataset.length) - 3*margin+5) 
				.attr('y', function (value, index) {                    
				return chartHeight   - (value * heightScalingFactor) -10
			  })
				 .attr('height', function (value, index) {              
				return value * heightScalingFactor +10
			  })
		}

	}
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
