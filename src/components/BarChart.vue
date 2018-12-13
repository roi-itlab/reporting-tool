<template>
    <div class="barchart">
        <div class='chart--title' v-if='title' :style=titleStyle>{{ title }}</div>
        <div class="barchart--flex">
            <div class='bar--chart'></div>
            <Legend v-if='legendReady' :props='legendConfig'></Legend>
        </div>
    </div>
</template>
<script>
import Legend from './Legend'
import * as d3 from 'd3'
import VueTypes from 'vue-types';
import Vue from 'vue';
export default {
    name: 'BarChart',
    components: { Legend },
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
            title: VueTypes.string,
            titleSize: VueTypes.string,
            titleColor: VueTypes.string,
            axis_y_name: VueTypes.string,
            size_axis_y_name: VueTypes.string,
            axis_x_name: VueTypes.string,
            size_axis_x_name: VueTypes.string,
            distance_between_grid_lines: VueTypes.number,
            color_vertical_lines_grid: VueTypes.string,
            color_horizontal_lines_grid: VueTypes.string,
            color_bar: VueTypes.string,
            width_bar: VueTypes.number,
            displayLegend: VueTypes.bool,
            legendConfig: VueTypes.object,
            dataSignVis: VueTypes.bool
        }).def({}),

        width_chart: VueTypes.number.def(800),
        height_chart: VueTypes.number.def(300),
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
        titleSize: VueTypes.string.def('2em'),
        titleColor: VueTypes.string.def('#008000'),
        axis_y_name: VueTypes.string.def("Count of crimes"),
        size_axis_y_name: VueTypes.string.def("11px"),
        axis_x_name: VueTypes.string.def("Type of crime"),
        size_axis_x_name: VueTypes.string.def("11px"),
        distance_between_grid_lines: VueTypes.number.def(20),
        color_vertical_lines_grid: VueTypes.string.def("#6789ab"),
        color_horizontal_lines_grid: VueTypes.string.def("#6789ab"),
        color_bar: VueTypes.string.def("green"),
        width_bar: VueTypes.number.def(3.2),
        distance_between_bars: VueTypes.number.def(2),
        displayLegend: VueTypes.bool.def(true),
        legendConfig: VueTypes.object.def({
            scroll: true,
            borderVis: true,
            borderColor: '#4CBB17',
            textColor: 'grey',
            textSize: 10,
            margin: 10,
            dataSignVis: true
        }),
        //dataSignVis: VueTypes.bool.def(true)
    },
    data: function() {
        return {
            title: 'Crimes in Nothgate for 2014',
            legendData: {
                name_legend: [],
                color_legend: []
            },
            legendReady: false,
            // dataSignVis: false
        }
    },
    mounted: function() {
        let chartWidthRect = this.props.width_chart || this.width_chart;
        let chartHeightRect = this.props.height_chart || this.height_chart;
        let margin = this.props.margin || this.margin;
        let color_chart = this.props.color_chart || this.color_chart;
        let thickness_axis_y = this.props.thickness_axis_y || this.thickness_axis_y;
        let color_axis_y = this.props.color_axis_y || this.color_axis_y;
        let thickness_ticks_y = this.props.thickness_ticks_y || this.thickness_ticks_y;
        let color_ticks_y = this.props.color_ticks_y || this.color_ticks_y;
        let thickness_axis_x = this.props.thickness_axis_x || this.thickness_axis_x;
        let color_axis_x = this.props.color_axis_x || this.color_axis_x;
        let thickness_ticks_x = this.props.thickness_ticks_x || this.thickness_ticks_x;
        let color_ticks_x = this.props.color_ticks_x || this.color_ticks_x;
        let axis_y_name = this.props.axis_y_name || this.axis_y_name;
        let size_axis_y_name = this.props.size_axis_y_name || this.size_axis_y_name;
        let axis_x_name = this.props.axis_x_name || this.axis_x_name;
        let size_axis_x_name = this.props.size_axis_x_name || this.size_axis_x_name;
        let distance_between_grid_lines = this.props.distance_between_grid_lines || this.distance_between_grid_lines;
        let color_vertical_lines_grid = this.props.color_vertical_lines_grid || this.color_vertical_lines_grid;
        let color_horizontal_lines_grid = this.props.color_horizontal_lines_grid || this.color_horizontal_lines_grid;
        let color_bar = this.props.color_bar || this.color_bar;
        let width_bar = this.props.width_bar || this.width_bar;
        let distance_between_bars = this.props.distance_between_grid_lines || this.distance_between_bars;
        let legendConfig = this.props.legendConfig || this.legendConfig;
        let displayLegend = this.props.displayLegend;
        let dataSignVis = this.props.dataSignVis || this.dataSignVis;
        this.title = this.props.title || this.title;

        if (displayLegend === undefined || displayLegend === null) {
            displayLegend = this.displayLegend;
        }

        let chartWidth;
        let chartHeight;
        let dbb;
        let tooltipTimerID = 0;
        this.legendData.name_legend = ["Crimes 2014", "Crimes 2015"];
        this.legendData.color_legend = ["#4CBB17", "green"];
        if (this.props.legendConfig === undefined) {
            this.props.legendConfig = legendConfig;
        }
        if (dataSignVis === undefined || dataSignVis === null) {
            dataSignVis = this.dataSignVis;
        }
        if (displayLegend) {
            this.props.legendConfig.legendDataColors = this.legendData.color_legend;
            this.props.legendConfig.legendDataLabels = this.legendData.name_legend;
            this.legendReady = true;
            this.dataSignVis = true;
        }
        // let map= d3.json("http://localhost:8090/api/posts",function(error,data){
        //      console.log(error);
        //    });

        // map
        // .then(data=>{toRunDraw(data);return data;})
        // .then();
        // const toRunDraw=(data)=>{
        //   var dataset = data.map(function(d) {return d.score;});
        var crimesdata = [{ name: "DUI-LIQUOR", score: 10919 }, { name: "CHILD-OTHER", score: 4385 },
            { name: "SEXOFF-OTHER", score: 4502 }, { name: "BURGLARY-FORCE-RES", score: 26909 },
            { name: "THEFT-CARPROWL", score: 15104 }, { name: "SEXOFF-SODOMY", score: 3305 }
        ];
        var crimesdata2 = [{ "name": "DUI-LIQUOR", "score": 9919 }, { "name": "CHILD-OTHER", "score": 2385 },
            { "name": "SEXOFF-OTHER", "score": 1502 }, { "name": "BURGLARY-FORCE-RES", "score": 15909 },
            { "name": "THEFT-CARPROWL", "score": 12104 }, { "name": "SEXOFF-SODOMY", "score": 2105 }
        ];

        var dataset = crimesdata.map(function(d) { return d.score; });
        var dataset2 = crimesdata2.map(function(d) { return d.score; });
        //get for axis x data
        var nameset = crimesdata.map(function(d) { return d.name; });
        // Sizing variables for our chart. These are saved as variables as they will be used in calculations.
        chartWidth = chartWidthRect - 30;
        chartHeight = chartHeightRect - 30;

        // длина оси X= ширина контейнера svg - отступ слева и справа
        var xAxisLength = chartWidth - 2 * margin;

        // длина оси Y = высота контейнера svg - отступ сверху и снизу
        var yAxisLength = chartHeight - 2 * margin;

        // функция интерполяции значений на ось X
        var xScale = d3.scaleBand()
            .range([0, chartWidth])
            .domain(nameset);

        // функция интерполяции значений на ось Y
        var yScale = d3.scaleLinear()
            .domain([
                d3.min(dataset, function(d) { return d - 10; }),
                d3.max(dataset, function(d) { return d + 10; })
            ]).range([chartHeight, 0]);

        //draw histogram
        // We want our our bars to take up the full height of the chart, so, we will apply a
        //scaling factor to the height of every bar
        var heightScalingFactor = chartHeight / getMax(dataset);

        //холст
        var substr = d3.select(this.$el).select(".bar--chart")
            .append('svg')
            .attr('width', chartWidthRect)
            .attr('height', chartHeightRect)
            .attr('class', "axis")
            .style('background', color_chart);
        // создаем ось X
        var xAxis = d3.axisBottom()
            .scale(xScale)

        // создаем ось Y
        var yAxis = d3.axisLeft()
            .scale(yScale)

        // отрисовка оси Y
        substr.append("g")
            .attr("class", "y-axis")
            .attr("transform",
                "translate(" + 1.5 * margin + "," + 0.05 + ")")
            //отрисовка тиков по оси у и их стиль
            .attr("stroke-width", thickness_ticks_y)
            .attr("stroke", color_ticks_y)
            .call(yAxis);

        //задаём стиль для линии оси У
        d3.selectAll('.axis path')
            .style("stroke", color_axis_y)
            .attr("stroke-width", thickness_axis_y);

        // отрисовка оси Х
        //2*margin - для отрисовки в пределах видимости (если margin - то оУ выползает за svg box)
        substr.append("g")
            .attr("class", "x-axis")
            .attr("transform",
                "translate(" + 1.5 * margin + "," + (chartHeight - 0.05 * margin) + ")")
            //отрисовка тиков по оси X и их стиль
            .attr("stroke-width", thickness_ticks_x)
            .attr("stroke", color_ticks_x)
            .call(xAxis);

        //задаём стиль для линии оси X
        d3.selectAll('.axis path')
            .style("stroke", color_axis_x)
            .attr("stroke-width", thickness_axis_x);

        //рисуем подписи осей
        //y
        substr.append("text")
            .attr("x", 9.5 * margin * (margin / 10))
            .attr("y", 15)
            .attr("text-anchor", "end")
            .style("font-size", size_axis_y_name)
            .text(axis_y_name);
        //x
        substr.append("text")
            .attr("x", chartWidthRect)
            .attr("y", chartHeightRect - 20)
            .attr("text-anchor", "end")
            .style("font-size", size_axis_x_name)
            .text(axis_x_name);

        //вертикальные линии сетки
        let dbgl = distance_between_grid_lines;
        //chartWidth/20)+1 - количество линий, dbgl - расстояние между линиями сетки
        substr.selectAll(".vline").data(d3.range((chartWidth / dbgl) + 1)).enter()
            .append("line")
            .attr("x1", function(d) {
                return 1.5 * margin + d * dbgl;
            })
            .attr("x2", function(d) {
                return 1.5 * margin + d * dbgl;
            })
            .attr("y1", function(d) {
                return 0;
            })
            .attr("y2", function(d) {
                return chartHeight;
            })
            .style("stroke", color_vertical_lines_grid);
        // горизонтальные линии
        substr.selectAll(".vline").data(d3.range(chartHeight / dbgl)).enter()
            .append("line")
            .attr("y1", function(d) {
                return d * dbgl;
            })
            .attr("y2", function(d) {
                return d * dbgl;
            })
            .attr("x1", function(d) {
                return 1.5 * margin;
            })
            .attr("x2", function(d) {
                return chartWidth + 1.5 * margin;
            })
            .style("stroke", color_horizontal_lines_grid);
        dbb = distance_between_bars;
        // создаем элемент g с набором столбиков
        substr.append("g")
            // сдвиг оси вправо
            .attr("transform", "translate(" + margin + ", 0)")
            .selectAll(".bar")
            .data(dataset)
            .enter().append("rect")
            .attr("class", "bar")
            //Add listener for the mouseover event
            .on("click", (value, index) => {
                d3.selectAll('.barTooltip').remove();
                if (tooltipTimerID) {
                    clearTimeout(tooltipTimerID);
                    tooltipTimerID = 0;
                }
                let tooltip = d3.select('.barchart')
                    .append('div')
                    .attr('class', 'barTooltip')
                    .style('left', d3.event.pageX + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style('display', 'block');
                tooltip.append('div')
                    .attr('class', 'barTooltipLabel')
                    .text(value);
            })
            .on('mouseout', () => {
                if (!tooltipTimerID) {
                    tooltipTimerID = setTimeout(() => {
                        d3.selectAll('.barTooltip').remove();
                    }, 1000)
                }
            })
            // Set the X position of the rectangle by taking the index of the current item we are creating,
            //multiplying it by the calculated width of each bar, and adding a padding value so we can see
            //some space between bars.
            .attr('x', function(value, index) {
                return (index * (chartWidth / dataset.length) + margin)
            })
            // The width is dynamically calculated to have an even distribution of bars that take up the
            //entire width of the chart.
            //3*padding - уменьшение толщины столбиков
            .attr('width', (chartWidth / dataset.length / 2))
            // Set the rectangle by subtracting the scaled height from the height of the chart
            //(this has to be done becuase SVG coordinates start with 0,0 at their top left corner).
            //0.9 в y и height отвечают за то, чтобы столбик не подпирал график
            .attr('y', function(value, index) {
                return chartHeight - (value * heightScalingFactor * 0.9)
            })
            .transition()
            .ease(d3.easeLinear)
            .duration(400)
            .delay(function(d, i) {
                return i * 50;
            })
            //.attr("height", function(d) { return chartHeight - yScale(d.score) - margin; })
            // The height is simply the value of the item in the dataset multiplied by the height scaling factor.
            .attr('height', function(value, index) {
                return (value * heightScalingFactor * 0.9)
            })
            .attr('fill', color_bar);

        //второй график
        // создаем элемент g с набором столбиков
        substr.append("g")
            // сдвиг оси вправо
            .attr("transform", "translate(" + margin + ", 0)")
            .selectAll(".bar")
            .data(dataset2)
            .enter().append("rect")
            .attr("class", "bar")
            //Add listener for the mouseover event
            .on("click", (value, index) => {
                d3.selectAll('.barTooltip').remove();
                if (tooltipTimerID) {
                    clearTimeout(tooltipTimerID);
                    tooltipTimerID = 0;
                }
                let tooltip = d3.select('.barchart')
                    .append('div')
                    .attr('class', 'barTooltip')
                    .style('left', d3.event.pageX + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style('display', 'block');
                tooltip.append('div')
                    .attr('class', 'barTooltipLabel')
                    .text(value);
            })
            .on('mouseout', () => {
                if (!tooltipTimerID) {
                    tooltipTimerID = setTimeout(() => {
                        d3.selectAll('.barTooltip').remove();
                    }, 1000)
                }
            })
            // Set the X position of the rectangle by taking the index of the current item we are creating,
            //multiplying it by the calculated width of each bar, and adding a padding value so we can see
            //some space between bars.
            .attr('x', function(value, index) {
                return (index * (chartWidth / dataset2.length)) + margin / 2
            })
            // The width is dynamically calculated to have an even distribution of bars that take up the
            //entire width of the chart.
            //3*padding - уменьшение толщины столбиков
            .attr('width', (chartWidth / dataset2.length / 2))
            // Set the rectangle by subtracting the scaled height from the height of the chart
            //(this has to be done becuase SVG coordinates start with 0,0 at their top left corner).
            //0.9 в y и height отвечают за то, чтобы столбик не подпирал график
            .attr('y', function(value, index) {
                return chartHeight - (value * heightScalingFactor * 0.9)
            })
            .transition()
            .ease(d3.easeLinear)
            .duration(400)
            .delay(function(d, i) {
                return i * 50;
            })
            //.attr("height", function(d) { return chartHeight - yScale(d.score) - margin; })
            // The height is simply the value of the item in the dataset multiplied by the height scaling factor.
            .attr('height', function(value, index) {
                return (value * heightScalingFactor * 0.9)
            })
            .attr('fill', "#4CBB17");

        //  ищем максимум для функции
        function getMax(collection) {
            var max = 0
            collection.forEach(function(element) {
                max = element > max ? element : max
            })
            return max
        }

    },
    computed: {
        titleStyle() {
            let titleSize = this.props.titleSize || this.titleSize;
            let titleColor = this.props.titleColor || this.titleColor;

            return {
                'font-size': titleSize,
                'color': titleColor
            };
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.barTooltip {
    z-index: 10;
    display: none;
    position: absolute;
    padding: 10px;
    min-width: 50px;

    font-size: 12px;
    text-align: center;
    line-height: 140%;
    font-weight: 300;

    color: rgba(0, 0, 0, 0.8);
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 5px #999999;
}

.barTooltipLabel {
    font-weight: 600;
}

.barchart {
    padding: 20px;
    border: 2px solid #bbb;
    border-radius: 10px;
}

.barchart--flex {
    display: flex;
    align-items: center;
}

.bar--chart {
    display: inline-block;
    vertical-align: top;

}

.barchart--flex--vertical {
    flex-direction: column;
}
</style>