<template>
    <div class='stacked'>
        <div class='chart--title' v-if='title' :style=titleStyle>{{ title }}</div>
        <div class='stacked--flex' :class='{ "stacked--flex--vertical": flexStyle }'>
            <svg class="stackedBar"></svg>
            <Legend class='stacked--legend' v-if='legendReady' :props='props.legendConfig'></Legend>
        </div>
    </div>
</template>
<script>
import PostsService from '@/services/PostsService';
import Legend from './Legend'
import * as d3 from 'd3'
import VueTypes from 'vue-types';
import Vue from 'vue';
export default {
    name: 'StackedBarChart',
    components: { Legend },
    props: {
        props: VueTypes.shape({
            serverConfig: VueTypes.string.isRequired,
            colorscheme: VueTypes.array,
            width_chart: VueTypes.number,
            height_chart: VueTypes.number,
            margin: VueTypes.object,
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
            padding_of_axis_x_oy: VueTypes.number,
            padding_of_axis_x_ox: VueTypes.number,
            size_axis_x_name: VueTypes.string,
            distance_between_grid_lines: VueTypes.number,
            thickness_vertical_lines: VueTypes.number,
            thickness_horizontal_lines: VueTypes.number,
            color_vertical_lines_grid: VueTypes.string,
            color_horizontal_lines_grid: VueTypes.string,
            color_bar: VueTypes.string,
            width_bar: VueTypes.number,
            displayLegend: VueTypes.bool,
            legendConfig: VueTypes.object,
        }).def({}),

        colorscheme: VueTypes.array.def(d3.schemeSet1),
        width_chart: VueTypes.number.def(960),
        height_chart: VueTypes.number.def(500),
        margin: VueTypes.object.def(() => { return { top: 20, right: 20, bottom: 30, left: 40 } }),
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
        titleColor: VueTypes.string.def('black'),
        axis_y_name: VueTypes.string.def("Population"),
        size_axis_y_name: VueTypes.string.def("11px"),
        axis_x_name: VueTypes.string.def("State"),
        padding_of_axis_x_oy: VueTypes.number.def(0.98),
        padding_of_axis_x_ox: VueTypes.number.def(40),
        size_axis_x_name: VueTypes.string.def("11px"),
        distance_between_grid_lines: VueTypes.number.def(20),
        thickness_vertical_lines: VueTypes.number.def(0.5),
        thickness_horizontal_lines: VueTypes.number.def(0.5),
        color_vertical_lines_grid: VueTypes.string.def("#6789ab"),
        color_horizontal_lines_grid: VueTypes.string.def("#6789ab"),
        width_bar: VueTypes.number.def(3.5),
        distance_between_bars: VueTypes.number.def(3),
        displayLegend: VueTypes.bool.def(true),
        legendConfig: VueTypes.object.def({})
    },
    data: function() {
        return {
            title: '',
            legendData: {
                name_legend: [],
                color_legend: []
            },
            legendReady: false,
            width_svg: 0,
            height_svg: 0
        }
    },
    methods: {
        async getQuery() {
            const response = await PostsService.fetchQuery(this.props.serverConfig);
            return response;
        }
    },
    mounted: function() {
        let colorscheme = this.props.colorscheme || this.colorscheme;
        let width_chart = this.props.width_chart || this.width_chart;
        let height_chart = this.props.height_chart || this.height_chart;
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
        let padding_of_axis_x_oy = this.props.padding_of_axis_x_oy || this.padding_of_axis_x_oy;
        let padding_of_axis_x_ox = this.props.padding_of_axis_x_ox || this.padding_of_axis_x_ox;
        let size_axis_x_name = this.props.size_axis_x_name || this.size_axis_x_name;
        let distance_between_grid_lines = this.props.distance_between_grid_lines || this.distance_between_grid_lines;
        let thickness_vertical_lines = this.props.thickness_vertical_lines || this.thickness_vertical_lines;
        let thickness_horizontal_lines = this.props.thickness_horizontal_lines || this.thickness_horizontal_lines;
        let color_vertical_lines_grid = this.props.color_vertical_lines_grid || this.color_vertical_lines_grid;
        let color_horizontal_lines_grid = this.props.color_horizontal_lines_grid || this.color_horizontal_lines_grid;
        let width_bar = this.props.width_bar || this.width_bar;
        let distance_between_bars = this.props.distance_between_grid_lines || this.distance_between_bars;
        let legendConfig = this.props.legendConfig || this.legendConfig;
        let displayLegend = this.props.displayLegend;
        let dataSignVis = this.props.dataSignVis || this.dataSignVis;
        this.title = this.props.title || this.title;

        if (displayLegend === undefined || displayLegend === null) {
            displayLegend = this.displayLegend;
        }

        let dbb;
        let tooltipTimerID = 0;
        this.legendData.name_legend = ["Under 5 Years", "5 to 13 Years", "14 to 17 Years", "18 to 24 Years", "25 to 44 Years", "45 to 64 Years", "65 Years and Over"].reverse();
        this.legendData.color_legend = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"].reverse();
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
        //передаём в svg параметры размера графика для отрисовки
        this.width_svg = width_chart;
        this.height_svg = height_chart;

        //создаём "холст"
        var svg = d3.select(this.$el).select(".stackedBar"),
            width = +this.width_svg - margin.left - margin.right,
            height = +this.height_svg - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.select(this.$el)
            .select('svg')
            .attr('width', this.width_svg)
            .attr('height', this.height_svg)
        //стиль для "холста"
        d3.select(this.$el).selectAll("svg")
            .style('background', color_chart);

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1)
            .align(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(colorscheme);

        this.getQuery().then(response => {
            toRunDraw(response.data[0]);
        })

        const toRunDraw = (data) => {

            var columns = d3.keys(data[0]);
            var keys = columns.slice(2);
            //delete count (last elemetn of array, so it's not use in legend and bars)
            keys.pop();


            data.sort(function(a, b) { return b.total - a.total; });
            x.domain(data.map(function(d, i) { return i; }));
            y.domain([0, d3.max(data, function(d) { return d.count; })]).nice();
            z.domain(keys);
            //вертикальные линии сетки
            let dbgl = distance_between_grid_lines;
            //chartWidth/20)+1 - количество линий, dbgl - расстояние между линиями сетки
            g.selectAll(".vline").data(d3.range((width / dbgl) + 1)).enter()
                .append("line")
                .attr("x1", function(d) {
                    return d * dbgl;
                })
                .attr("x2", function(d) {
                    return d * dbgl;
                })
                .attr("y1", function(d) {
                    return 0;
                })
                .attr("y2", function(d) {
                    return height;
                })
                .style("stroke", color_vertical_lines_grid)
                .attr("stroke-width", thickness_vertical_lines);

            // горизонтальные линии
            g.selectAll(".vline").data(d3.range(height / dbgl)).enter()
                .append("line")
                .attr("y1", function(d) {
                    return d * dbgl;
                })
                .attr("y2", function(d) {
                    return d * dbgl;
                })
                .attr("x1", function(d) {
                    return 0
                })
                .attr("x2", function(d) {
                    return width;
                })
                .style("stroke", color_horizontal_lines_grid)
                .attr("stroke-width", thickness_horizontal_lines);

            //гистограамма
            g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))
                .enter().append("g")
                .attr("fill", function(d) { return z(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d, i) { return x(i); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth());

            //ось х
            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                //отрисовка тиков по оси x и их стиль        
                .attr("stroke-width", thickness_ticks_x)
                .attr("stroke", color_ticks_x)
                .call(d3.axisBottom(x).tickFormat(function(d, i) { return data[i].State }))
                .append("text")
                .attr("x", width - padding_of_axis_x_ox)
                .attr("y", height - (height * padding_of_axis_x_oy))
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .style("font-size", size_axis_x_name)
                .text(axis_x_name);

            //задаём стиль для линии оси x      
            d3.selectAll('.axis path')
                .style("stroke", color_axis_x)
                .attr("stroke-width", thickness_axis_x);

            g.append("g")
                .attr("class", "axis")
                //отрисовка тиков по оси y и их стиль        
                .attr("stroke-width", thickness_ticks_y)
                .attr("stroke", color_ticks_y)
                .call(d3.axisLeft(y).ticks(null, "s"))
                .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .style("font-size", size_axis_y_name)
                .text(axis_y_name);

            //задаём стиль для линии оси y     
            d3.select(this.$el).selectAll('.axis path')
                .style("stroke", color_axis_y)
                .attr("stroke-width", thickness_axis_y);

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
    }
}
</script>
<style>
.stacked--flex {
    display: flex;
    align-items: center;
}

.stacked--flex--vertical {
    flex-direction: column;
}
</style>