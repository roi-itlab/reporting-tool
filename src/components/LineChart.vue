<template>
    <div class="lineChart">

        <div class='line--flex' :class='{ "line--flex--vertical": flexStyle }'>
            <div class='line--chart'></div>
            <Legend class='line--legend' v-if='legendReady' :props='props.legendConfig'></Legend>
        </div>
        <div class='line--title' v-if='title' :style=titleStyle>{{ title }}</div>
    </div>
</template>
<script>
import PostsService from '@/services/PostsService'
import VueTypes from 'vue-types';
import * as d3 from 'd3'
import Legend from './Legend'
import PostServices from '@/services/PostsService'
export default {
    components: { Legend },
    props: {
        props: VueTypes.shape({
            serverConfig: VueTypes.string,
            backgroundColor: VueTypes.string,
            width: VueTypes.number,
            height: VueTypes.number,
            margin: VueTypes.object,
            symbolXColor: VueTypes.string,
            symbolYColor: VueTypes.string,
            circlesRad: VueTypes.number,
            circlesVis: VueTypes.bool,
            circlesStrokeColor: VueTypes.array,
            circlesFillColor: VueTypes.array,
            lineVis: VueTypes.bool,
            linesColor: VueTypes.array,
            axisXColor: VueTypes.string,
            axisYColor: VueTypes.string,
            lineDepth: VueTypes.number,
            axesDepth: VueTypes.number,
            strokeXColor: VueTypes.string,
            strokeYColor: VueTypes.string,
            strokeYDepth: VueTypes.number,
            strokeXDepth: VueTypes.number,
            symbolXSize: VueTypes.number,
            symbolYSize: VueTypes.number,
            strokeXCount: VueTypes.number,
            strokeYCount: VueTypes.number,
            areaColor: VueTypes.array,
            areaVis: VueTypes.bool,
            gridY: VueTypes.number,
            gridX: VueTypes.number,
            gridColor: VueTypes.string,
            gridVis: VueTypes.bool,
            areaOpacity: VueTypes.number,
            dataCount: VueTypes.number,
            borderWidth: VueTypes.numbe,
            dataXPath: VueTypes.string,
            dataYPath: VueTypes.array,
            backgroundColor: VueTypes.string,
            displayLegend: VueTypes.bool,
            legendConfig: VueTypes.object,
			titleSize: VueTypes.string,
			titleColor: VueTypes.string,
			title: VueTypes.string
        }).def({}),

        backgroundColor: VueTypes.string.def('Gainsboro'),
        width: VueTypes.number.def(800),
        height: VueTypes.number.def(300),
        margin: VueTypes.object.def(() => { return { left: 30, right: 10, top: 10, bottom: 20 } }),
        symbolXColor: VueTypes.string.def('black'),
        symbolYColor: VueTypes.string.def('black'),
        circlesRad: VueTypes.number.def(5),
        circlesVis: VueTypes.bool.def(false),
        circlesStrokeColor: VueTypes.string.def('white'),
        circlesFillColor: VueTypes.string.def('white'),
        lineVis: VueTypes.bool.def(false),
        linesColor: VueTypes.array.def(['lightskyblue']),
        axisXColor: VueTypes.string.def('black'),
        axisYColor: VueTypes.string.def('black'),
        lineDepth: VueTypes.number.def(2),
        axesDepth: VueTypes.number.def(2),
        strokeXColor: VueTypes.string.def('black'),
        strokeYColor: VueTypes.string.def('black'),
        strokeYDepth: VueTypes.number.def(1),
        strokeXDepth: VueTypes.number.def(2),
        symbolXSize: VueTypes.number.def(10),
        symbolYSize: VueTypes.number.def(10),
        strokeXCount: VueTypes.number.def(10),
        strokeYCount: VueTypes.number.def(10),
        areaColor: VueTypes.array.def(['royalblue']),
        areaVis: VueTypes.bool.def(false),
        gridY: VueTypes.number.def(20),
        gridX: VueTypes.number.def(20),
        gridColor: VueTypes.string.def('grey'), // default: 'lavender',
        gridVis: VueTypes.bool.def(false),
        areaOpacity: VueTypes.number.def(0.5),
        dataCount: VueTypes.number.def(0),
		titleSize: VueTypes.string.def('2em'),
		titleColor: VueTypes.string.def('black'),
        borderWidth: VueTypes.number.def(2),
    },
    data: function() {
        return {
			title: '',
            generalDataset: [],
            legendReady: false
        }
    },
    name: 'LineChart',
    mounted: function() {

        const response = PostServices.fetchQuery(this.props.serverConfig);
        response.then(result => {
            for (let j = 0; j < this.props.dataCount; ++j) {
                let temp = []
                for (let d of result.data[0])
                    temp.push({ x: d[this.props.dataXPath], y: d[this.props.dataYPath[j]] })
                this.generalDataset.push(temp)
            }
            this.createSvg()
        })

        // setInterval(()=> {
        //   const response = PostServices.fetchQuery(this.props.serverConfig);
        //   this.generalDataset = []
        //   response.then(result => {
        //     for (let j = 0; j < this.props.dataCount; ++j) {
        //       let temp = []
        //       for (let d of result.data[0])
        //         temp.push({ x: d[this.props.dataXPath], y: d[this.props.dataYPath[j]] })
        //       this.generalDataset.push(temp)
        //     }
        //     d3.select(this.$el).select('.line--chart').selectAll('svg').remove();
        //     this.createSvg();
        //   })
        // }, 1000);

		// setInterval(()=> {
		// 	this.updateData();
		// }, 1000);
    },
    computed: {
        flexStyle() {
            let align = this.props.legendConfig.alignment;
            if (typeof align === 'string' || align instanceof String) {
                if (align.localeCompare(
                        'top',
                        'en', { sensitivity: 'base' }) === 0 ||
                    align.localeCompare(
                        'bottom',
                        'en', { sensitivity: 'base' }) === 0
                ) {
                    return true;
                }
            }

            return false;
        },
		titleStyle() {
			let titleSize = this.props.titleSize || this.titleSize;
			let titleColor = this.props.titleColor || this.titleColor;

			return {
				'font-size': titleSize,
				'color': titleColor
			};
		}
    },
    methods: {
		// updateData(){
		// 	const response = PostServices.fetchQuery(this.props.serverConfig);
		// 	response.then(result => {
		// 		for (let j = 0; j < this.props.dataCount; ++j) {
		// 			let temp = []
		// 			for (let d of result.data[0])
		// 				temp.push({ x: d[this.props.dataXPath], y: d[this.props.dataYPath[j]] })
		// 			this.generalDataset.push(temp)
		// 		}
		// 	})
        //
		// 	let width = this.props.width || this.width
		// 	let height = this.props.height || this.height
        //
		// 	let maxX = d3.max(this.generalDataset[0].map(function(d) { return d.x; }));
		// 	let minX = d3.min(this.generalDataset[0].map(function(d) { return d.x; }));
        //
		// 	let minY = d3.min(this.generalDataset[0].map(function(d) { return d.y; }))
		// 	let maxY = d3.max(this.generalDataset[0].map(function(d) { return d.y; }))
        //
		// 	let line = d3.line()
		// 		.x(function(d) {
		// 			return xScale(d.x);
		// 		})
		// 		.y(function(d) {
		// 			return yScale(d.y);
		// 		})
		// 		.curve(d3.curveMonotoneX)
        //
		// 	let xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width])
		// 	let yScale = d3.scaleLinear().domain([minY - Math.abs(minY * 0.1), maxY + Math.abs(maxY * 0.1)]).range([height, 0])
        //
		// 	let svg = d3.select(this.$el).select(".line--chart").transition()
        //     for (let i = 0; i < this.generalDataset.length; ++i) {
		// 		svg.select(".line" + i)   // change the line
		// 			.duration(2000)
		// 			.attr("d", line(this.generalDataset[i]));
		// 		console.log(svg.select(".line" + i))
		// 	}
        //
		// 	svg.select(".x-axis")
		// 		.duration(2000)
		// 		.call(d3.axisBottom(xScale))
        //
        //
        //
		// 	svg.select(".y-axis")
		// 		.duration(2000)
		// 		.call(d3.axisLeft(yScale))
		// 	},

        createSvg() {
            let backgroundColor = this.props.backgroundColor || this.backgroundColor
            let width = this.props.width || this.width
            let height = this.props.height || this.height
            let margin = this.props.margin || this.margin
            let symbolXColor = this.props.symbolXColor || this.symbolXColor
            let symbolYColor = this.props.symbolYColor || this.symbolYColor
            let circlesRad = this.props.circlesRad || this.circlesRad
            let circlesVis = this.props.circlesVis || this.circlesVis
            let circlesStrokeColor = this.props.circlesStrokeColor || this.circlesStrokeColor
            let circlesFillColor = this.props.circlesFillColor || this.circlesFillColor
            let lineVis = this.props.lineVis || this.lineVis
            let linesColor = this.props.linesColor || this.linesColor
            let axisXColor = this.props.axisXColor || this.axisXColor
            let axisYColor = this.props.axisYColor || this.axisYColor
            let lineDepth = this.props.lineDepth || this.lineDepth
            let axesDepth = this.props.axesDepth || this.axesDepth
            let strokeXColor = this.props.strokeXColor || this.strokeXColor
            let strokeYColor = this.props.strokeYColor || this.strokeYColor
            let strokeYDepth = this.props.strokeYDepth || this.strokeYDepth
            let strokeXDepth = this.props.strokeXDepth || this.strokeXDepth
            let symbolXSize = this.props.symbolXSize || this.symbolXSize
            let symbolYSize = this.props.symbolYSize || this.symbolYSize
            let strokeXCount = this.props.strokeXCount || this.strokeXCount
            let areaColor = this.props.areaColor || this.areaColor
            let areaVis = this.props.areaVis || this.areaVis
            let gridY = this.props.gridY || this.gridY
            let gridX = this.props.gridX || this.gridX
            let gridColor = this.props.gridColor || this.gridColor
            let gridVis = this.props.gridVis || this.gridVis
            let areaOpacity = this.props.areaOpacity || this.areaOpacity
            let dataCount = this.props.dataCount || this.dataCount
            let borderWidth = this.props.borderWidth || this.borderWidth

            let maxX = d3.max(this.generalDataset[0].map(function(d) { return d.x; }));
            let minX = d3.min(this.generalDataset[0].map(function(d) { return d.x; }));

            let minY = d3.min(this.generalDataset[0].map(function(d) { return d.y; }))
            let maxY = d3.max(this.generalDataset[0].map(function(d) { return d.y; }))
            for (let i = 1; i < this.props.dataCount; ++i) {
                let minTemp = d3.min(this.generalDataset[i].map(function(d) { return d.y; }))
                let maxTemp = d3.max(this.generalDataset[i].map(function(d) { return d.y; }))


                minY = minY < minTemp ? minY : minTemp
                maxY = maxY > maxTemp ? maxY : maxTemp
            }

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

            xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width])
            yScale = d3.scaleLinear().domain([minY - Math.abs(minY * 0.1), maxY + Math.abs(maxY * 0.1)]).range([height, 0])

            //draw line
            line = d3.line()
                .x(function(d) {
                    return xScale(d.x);
                })
                .y(function(d) {
                    return yScale(d.y);
                })
                .curve(d3.curveMonotoneX)

            //draw area
            if (areaVis) {
                area = d3.area()
                    .x(function(d, i) {
                        return xScale(d.x);
                    })
                    .y1(function(d) {
                        return yScale(d.y);
                    })
                    .y0(height)
                    .curve(d3.curveMonotoneX)
            }

            svg = d3.select(this.$el).select('.line--chart').append('svg')
                .attr('class', 'line--svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


            svg.append('rect').attr('class', 'bg')
                .attr('height', height)
                .attr('width', width)
                .attr('fill-opacity', 0.5)
                .attr('fill', backgroundColor)
                .attr("transform", () => {
                    return "translate(" + borderWidth + "," + borderWidth + ")"
                })
                .attr('stroke-width', borderWidth).attr('rx', 5).attr('ry', 5)


            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale))

            //draw grid
            if (gridVis) {
                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(0," + height + ")")
                    .call(make_x_gridlines(gridX)
                        .tickSize(-height)
                        .tickFormat(""))

                svg.append("g")
                    .attr("class", "grid")
                    .call(make_y_gridlines(gridY)
                        .tickSize(-width)
                        .tickFormat("")
                    )
            }

            for (let i = 0; i < dataCount; ++i) {
                if (areaVis) {
                    svg.append("path")
                        .datum(this.generalDataset[i])
                        .attr("class", "area" + i)
                        .attr("fill", areaColor[i])
                        .attr("opacity", areaOpacity)
                        .attr("d", area)
                }

                if (lineVis) {
                    svg.append("path")
                        .attr("class", "line" + i)
                        .attr("fill", "none")
                        .attr("stroke-width", lineDepth)
                        .attr("stroke", linesColor[i])
                        .attr("d", line(this.generalDataset[i]))

                }
                if (circlesVis) {
                    svg.selectAll(".dot" + i)
                        .data(this.generalDataset[i])
                        .enter().append("circle")
                        .attr("class", "dot" + i)
                        .attr("cx", function(d, i) {
                        	console.log(i)
                        	return xScale(d.x) })
                        .attr("cy", function(d) { return yScale(d.y) })
                        .attr("r", circlesRad)
                        .attr("fill", circlesFillColor[i])
                        .attr("stroke", circlesStrokeColor[i])
                        .on('mouseover', function() { this.setAttribute('r', +this.getAttribute('r') + 2) })
                        .on('mouseout', function() { this.setAttribute('r', +this.getAttribute('r') - 2) })
                }
            }

			this.title = this.props.title || this.title;
			if (this.title) {
				let titleSize = this.props.titleSize || this.titleSize;
				let titleColor = this.props.titleColor || this.titleColor;

				d3.select(this.$el)
					.select('.pie--title')
					.style('font-size', titleSize)
					.style('color', titleColor);
			}

            svg.append('text')
                .text('price (thousand dollars)')
                .attr('font-size', 12)
                .attr('y', 12)
                .attr('x', 5)

            svg.append('text')
                .text('time')
                .attr('font-size', 12)
                .attr('y', height + 30)
                .attr('x', width - 20)

            svg.select('.y-axis > path')
                .attr('stroke', axisYColor)
                .attr('stroke-width', axesDepth)

            svg.select('.x-axis > path')
                .attr('stroke', axisXColor)
                .attr('stroke-width', axesDepth)

            svg.selectAll('.x-axis > tick > line')
                .attr('stroke', strokeXColor)
                .attr('stroke-width', strokeXDepth)

            svg.selectAll('.y-axis > .tick > line')
                .attr('stroke', strokeYColor)
                .attr('stroke-width', strokeYDepth)

            svg.selectAll('.x-axis > .tick > text')
                .attr('fill', symbolXColor)
                .attr('font-size', symbolXSize)

            svg.selectAll('.y-axis > .tick > text')
                .attr('fill', symbolYColor)
                .attr('font-size', symbolYSize)

            svg.selectAll('.grid > .tick > line').attr("stroke", gridColor)

            this.legendReady = true;


			var inter = setInterval(()=> {
				const response = PostServices.fetchQuery(this.props.serverConfig);
				response.then(result => {
					this.generalDataset = []
					for (let j = 0; j < this.props.dataCount; ++j) {
						let temp = []
						for (let d of result.data[0])
							temp.push({ x: d[this.props.dataXPath], y: d[this.props.dataYPath[j]] })
						this.generalDataset.push(temp)
					}
				})

				maxX = d3.max(this.generalDataset[0].map(function(d) { return d.x; }));
				minX = d3.min(this.generalDataset[0].map(function(d) { return d.x; }));

				minY = d3.min(this.generalDataset[0].map(function(d) { return d.y; }))
				maxY = d3.max(this.generalDataset[0].map(function(d) { return d.y; }))
				for (let i = 1; i < this.props.dataCount; ++i) {
					let minTemp = d3.min(this.generalDataset[i].map(function(d) { return d.y; }))
					let maxTemp = d3.max(this.generalDataset[i].map(function(d) { return d.y; }))


					minY = minY < minTemp ? minY : minTemp
					maxY = maxY > maxTemp ? maxY : maxTemp
				}


				xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width])
				yScale = d3.scaleLinear().domain([minY - Math.abs(minY * 0.1), maxY + Math.abs(maxY * 0.1)]).range([height, 0])


				let svg2 = svg.transition();

				for (let i = 0; i < dataCount; ++i) {

					if (areaVis) {
						svg2.select(".area" + i)
							.duration(1000)
							.attr("d", area(this.generalDataset[i]))
					}

					if (lineVis) {
						svg2.select(".line" + i)
							.duration(1000)
							.attr("d", line(this.generalDataset[i]));

					}
					let k = 0;
					let j = 0;
					// if (circlesVis) {
					// 	svg2.selectAll(".dot" + i)
					// 		.duration(500)
                    //
					// 		.attr("cx", ()=> {
					// 			if (k >= this.generalDataset[i].length) k = 0;
					// 			return xScale(this.generalDataset[i][k++].x) })
					// 		.attr("cy", ()=> {
					// 			if (j >= this.generalDataset[i].length) j = 0;
					// 			return yScale(this.generalDataset[i][j++]) })
					// }
				}
				svg2.select(".x-axis")
					.duration(1000)
					.call(d3.axisBottom(xScale));
				svg2.select(".y-axis")
					.duration(1000)
					.call(d3.axisLeft(yScale));
			}, 3000);
        }
    },
}
</script>
<style>
.line--flex {
    display: flex;
    align-items: center;
}

.line--flex--vertical {
    flex-direction: column;
}

.line--chart {
    display: inline-block;
    vertical-align: top;

}
.line--title {
    width: 100%;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>
