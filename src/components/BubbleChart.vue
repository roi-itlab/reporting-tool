<template>
    <div class='bubble'>
        <div class='chart--title' v-if='title' :style=titleStyle>{{ title }}</div>
        <button class="glo" @click="resetShowDiagram">ResetZoom</button>
        <div class='bubble--flex' :class='{ "bubble--flex--vertical": flexStyle }'>
            <div class="bubbleChart"> </div>
            <Legend class='bubble--legend' v-if='legendReady' :props='props.legendConfig'></Legend>
        </div>
    </div>
</template>
<script>
const d3 = require('d3');
import PostsService from '@/services/PostsService';
import Legend from './Legend';
import VueTypes from 'vue-types';

export default {
    name: 'BubbleChart',
    components: { Legend },
    props: {
        props: VueTypes.shape({
            serverConfig: VueTypes.string.isRequired,
            asixYKey: VueTypes.string.isRequired,
            asixXKey: VueTypes.string.isRequired,
            radiusKey: VueTypes.string.isRequired,
            categoryKey: VueTypes.string.isRequired,
            maxDiameter: VueTypes.number,
            minDiameter: VueTypes.number,
            circleStrokeColor: VueTypes.string,
            circleStrokeWidth: VueTypes.number,
            maxZoom: VueTypes.number,
            gridY: VueTypes.bool,
            gridX: VueTypes.bool,
            gridColor: VueTypes.string,
            gridWidth: VueTypes.number,
            gridColorOpacity: VueTypes.number,
            axisYTicks: VueTypes.number,
            axisXTicks: VueTypes.number,
            axisXColor: VueTypes.string,
            axisYColor: VueTypes.string,
            axisWidth: VueTypes.number,
            nameAsixX: VueTypes.string,
            nameAsixY: VueTypes.string,
            nameRadius: VueTypes.string,
            width: VueTypes.number,
            height: VueTypes.number,
            title: VueTypes.string,
            titleSize: VueTypes.string,
            titleColor: VueTypes.string,
            backGroundSvg: VueTypes.bool,
            colorscheme: VueTypes.array,
            displayLegend: VueTypes.bool,
            legendConfig: VueTypes.object
        }),
        maxDiameter: VueTypes.number.def(50),
        minDiameter: VueTypes.number.def(10),
        circleStrokeColor: VueTypes.string.def("#000"),
        circleStrokeWidth: VueTypes.number.def(1),
        maxZoom: VueTypes.number.def(50),
        gridY: VueTypes.bool.def(true),
        gridX: VueTypes.bool.def(true),
        gridColor: VueTypes.string.def("#000"),
        gridWidth: VueTypes.number.def(0.5),
        gridColorOpacity: VueTypes.number.def(0.7),
        axisYTicks: VueTypes.number.def(13),
        axisXTicks: VueTypes.number.def(13),
        axisXColor: VueTypes.string.def("null"),
        axisYColor: VueTypes.string.def("null"),
        axisWidth: VueTypes.number.def(0.5),
        nameAsixX: VueTypes.string.def("axis X"),
        nameAsixY: VueTypes.string.def("axis Y"),
        nameRadius: VueTypes.string.def("Radius"),
        nameCategory: VueTypes.string.def("Category"),
        width: VueTypes.number.def(900),
        height: VueTypes.number.def(600),
        backGroundSvg: VueTypes.bool.def(true),
        colorscheme: VueTypes.array.def(['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666']),
        displayLegend: VueTypes.bool.def(true),
        titleSize: VueTypes.string.def('2em'),
        titleColor: VueTypes.string.def('black'),
        legendConfig: VueTypes.object.def({})
    },
    data() {
        return {
            draw: {
                currentX: this.props.asixXKey,
                currentY: this.props.asixYKey,
                currentR: this.props.radiusKey,
                currentC: this.props.categoryKey,
            },
            title: '',
            drawsKeys: [],
            objData: [],
            legendData: {
                labels: [],
                colors: []
            },
            legendReady: false,

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
    },
    mounted: function() {
        this.updateData();
    },
    methods: {
        async getQuery() {
            const response = await PostsService.fetchQuery(this.props.serverConfig);
            return response;
        },
        updateData() {
            this.getQuery().then(response => {
                this.objData = response.data[0];
                this.showDiagram();
            })
        },
        resetShowDiagram() {
            if (d3.select(this.$el).select(".bubbleChart"))
                d3.select(this.$el).select(".bubbleChart").selectAll("svg").remove();
            this.showDiagram();
        },
        showDiagram: function() {
            // удаление svg элемента если он сущестувует
            //if(d3.select(".bubbleChart")){d3.select(".bubbleChart").selectAll("svg").remove();}

            let maxDiameter = this.props.maxDiameter || this.maxDiameter;
            let minDiameter = this.props.minDiameter || this.minDiameter;
            let circleStrokeColor = this.props.circleStrokeColor || this.circleStrokeColor;
            let circleStrokeWidth = this.props.circleStrokeWidth || this.circleStrokeWidth;
            let maxZoom = this.props.maxZoom || this.maxZoom;
            let gridY = this.props.gridY || this.gridY;
            let gridX = this.props.gridX || this.gridX;
            let gridColor = this.props.gridColor || this.gridColor;
            let gridWidth = this.props.gridWidth || this.gridWidth;
            let gridColorOpacity = this.props.gridColorOpacity || this.gridColorOpacity;
            let axisYTicks = this.props.axisYTicks || this.axisYTicks;
            let axisXTicks = this.props.axisXTicks || this.axisXTicks;
            let axisXColor = this.props.axisXColor || this.axisXColor;
            let axisYColor = this.props.axisYColor || this.axisYColor;
            let axisWidth = this.props.axisWidth || this.axisWidth;
            let nameAsixX = this.props.nameAsixX || this.nameAsixX;
            let nameAsixY = this.props.nameAsixY || this.nameAsixY;
            let nameRadius = this.props.nameRadius || this.nameRadius;
            let nameCategory = this.props.nameCategory || this.nameCategory;
            let width = this.props.width || this.width;
            let height = this.props.height || this.height;
            let backGroundSvg = this.props.backGroundSvg || this.backGroundSvg;
            let colorscheme = this.props.colorscheme || this.colorscheme;
            let displayLegend = this.props.displayLegend || this.displayLegend;
            let legendConfig = this.props.legendConfig || this.legendConfig;
            this.title = this.props.title || this.title;

            const w = width;
            const h = height;
            const padding = { top: h * 0.15, right: w * 0.12, bottom: h * 0.15, left: w * 0.12 };

            let t = this;
            let x = this.draw.currentX;
            let y = this.draw.currentY;
            let r = this.draw.currentR;
            let c = this.draw.currentC;
            let tableCategory = deleteDuplicate(t.objData.map(function(curr) { return curr[c] }));

            t.legendData.labels = tableCategory;

            let color = d3.scaleOrdinal()
                .domain(0, tableCategory.length)
                .range(colorscheme);

            t.legendData.labels.forEach(function(element, index) {
                t.legendData.colors.push(color(index));
            });

            let zoom = d3.zoom()
                .scaleExtent([1, maxZoom])
                .on("zoom", zoomed);

            let linearR = getScaleLinear(this.objData, r, minDiameter, maxDiameter);
            let linearX = getScaleLinear(this.objData, x, 0, w - padding.right - padding.left);
            let linearY = getScaleLinear(this.objData, y, h - padding.bottom - padding.top, 0);

            // создаем набор вертикальных линий для сетки
            let svg = d3.select(this.$el).select(".bubbleChart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .call(zoom)
                .classed("svgBack", backGroundSvg)
                .append("g")
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

            let xAxis = d3.axisBottom()
                .ticks(axisXTicks)
                .scale(linearX);

            let yAxis = d3.axisLeft()
                .ticks(axisYTicks) //указать переменные
                .scale(linearY);

            let LineX = svg.append('g')
                .style("stroke", axisXColor)
                .style("fill", axisXColor)
                .style("stroke-width", axisWidth)
                .attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
                .attr("class", "x-axis")
                .call(xAxis);


            let LineY = svg.append("g")
                .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .attr("class", "y-axis")
                .style("stroke", axisYColor)
                .style("fill", axisYColor)
                .style("stroke-width", axisWidth)
                .call(yAxis);

            svg.append("text")
                .attr("x", padding.left)
                .attr("y", padding.top - 11)
                .attr("class", "asixText")
                .attr("text-anchor", "end")
                .text(nameAsixY);

            svg.append("text")
                .attr("x", w - padding.right + 2)
                .attr("y", h - padding.bottom + 22)
                .attr("class", "asixText")
                .attr("text-anchor", "start")
                .text(nameAsixX);

            if (gridX) {
                d3.select(t.$el)
                    .selectAll("g.x-axis g.tick")
                    .append("line")
                    .style("stroke", gridColor) // указать переменную
                    .style("stroke-width", gridWidth)
                    .style("stroke-opacity", gridColorOpacity)
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", -(h - padding.top - padding.bottom));
            }

            if (gridY) {
                d3.select(t.$el)
                    .selectAll("g.y-axis g.tick")
                    .append("line")
                    .style("stroke", gridColor) // указать переменную
                    .style("stroke-width", gridWidth)
                    .style("stroke-opacity", gridColorOpacity)
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", (w - padding.left - padding.right))
                    .attr("y2", 0);
            }
            let bubbles = svg.append("g")
                .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                .selectAll(".bubble")
                .data(this.objData)
                .enter();

            let bubbleAdd = bubbles.append("circle")
                .attr("r", d => linearR(d[r]))
                .attr("cx", d => linearX(d[x]))
                .attr("cy", d => linearY(d[y]))
                .attr("id", (d, i) => `#circleText${i}`)
                .style("fill", function(d, i) {
                    let cat = d[c];
                    let cur = tableCategory.indexOf(cat);
                    return color(cur);
                })
                .style("stroke", circleStrokeColor) // указать переменную
                .style("stroke-width", circleStrokeWidth)
                .style("cursor", "pointer")
                .on("click", function(d, i, elem) {
                    let textBlock = d3.select('.textBlock')
                    if (!textBlock._groups[0][0]) {
                        setText(d, elem[i])
                    } else if (textBlock._groups[0][0]) {
                        removeText();
                        setText(d, elem[i]);

                    }
                });

            function zoomed() {
                svg.attr("transform", "translate(" + [d3.event.transform.x, d3.event.transform.y] + ")" + " scale(" + d3.event.transform.k + ")");
                bubbleAdd.attr("r", d => linearR(d[r]) / d3.event.transform.k).style("stroke-width", circleStrokeWidth / d3.event.transform.k);

                LineX.style("stroke-width", axisWidth / d3.event.transform.k);
                LineY.style("stroke-width", axisWidth / d3.event.transform.k);
                d3.select(t.$el).selectAll("g.y-axis g.tick line").style("translate", "( 0 ," + 0.5 / d3.event.transform.k + ")");
                d3.select(t.$el).selectAll("g.tick").style("stroke-width", gridWidth / d3.event.transform.k);
                d3.select(t.$el).selectAll("g.tick text").attr("font-size", (12 / d3.event.transform.k) + "px");
                d3.select(t.$el).selectAll("g.tick line").style("stroke-width", gridWidth / d3.event.transform.k);
            };

            if (this.displayLegend) {
                if (this.props.legendConfig === undefined) {
                    this.props.legendConfig = legendConfig;
                }

                this.props.legendConfig.legendDataColors = this.legendData.colors;
                this.props.legendConfig.legendDataLabels = this.legendData.labels;
                if (this.props.legendConfig.scroll && !this.props.legendConfig.maxHeight) {
                    this.props.legendConfig.maxHeight = (legendConfig.alignment == "right" || legendConfig.alignment == "left") ? h + 'px' : 200 + 'px';
                }
                this.legendReady = true;
            }

            function deleteDuplicate(array) {
                return array.filter(function(item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                })
            }

            function getScaleLinear(obj, key, rangeMin, rangeMax) {
                return d3.scaleLinear()
                    .domain(d3.extent(t.objData.map(function(curr) { return Number.parseInt(curr[key]) })))
                    .range([rangeMin, rangeMax]);
            }

            function getScaleDate(obj, key, rangeMin, rangeMax) {
                return d3.scaleTime()
                    .domain(d3.extent(t.objData.map(function(curr) { return Number.parseInt(curr[key]) })))
                    .range([rangeMin, rangeMax]);
            }

            function setText(d, elem) {
                let textBlock = d3.select(t.$el).select(".bubbleChart")
                    .append("div")
                    .attr("class", "textBlock")
                    .style('display', 'block')
                    .style('left', (d3.event.pageX + 'px'))
                    .style('top', (d3.event.pageY + 'px'));

                textBlock.append("div")
                    .text(nameAsixY + " : " + d[y]);

                textBlock.append("div")
                    .text(nameAsixX + " : " + d[x]);

                textBlock.append("div")
                    .text(nameRadius + " : " + d[r]);

                textBlock.append("div")
                    .text(nameCategory + " : " + d[c]);

                textBlock.append("div")
                    .attr("class", "close")
                    .attr("title", "close")
                    .on("click", s => removeText());

                d3.selectAll("circle")
                    .style("stroke", t.circleStrokeColor)
                    .style("fill-opacity", 1);

                d3.select(elem)
                    .style("stroke", "skyBlue")
                    .style("fill-opacity", ".8");

            }

            function removeText() {
                d3.select('.textBlock').remove();
                d3.selectAll("circle")
                    .style("stroke", t.circleStrokeColor)
                    .style("fill-opacity", 1);
            }

        }

    },

}
</script>
<style scooped>
.bubble {
    display: inline-block;
}

.bubble .nameText {
    "fill": white;
    "font-family": Helvetica Neue, Helvetica, Arial, san-serif;
    "font-size": 16px;
    "text-anchor": end;
}

.bubble .asixText {
    "fill": black;
    "stroke": black;
    "font-family": Helvetica Neue, Helvetica, Arial, san-serif;
    "font-size": 0.8em;
}

.bubble .svgBack {
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid #000;
}

.bubble .textBlock {
    z-index: 10;
    display: none;
    position: absolute;
    padding: 10px;
    min-width: 100px;

    font-size: 12px;
    text-align: center;
    line-height: 140%;
    font-weight: 300;

    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 2px;
    box-shadow: 0 0 5px #999999;
}

.bubble .close {
    position: absolute;
    right: 0px;
    top: 2px;
    width: 17px;
    height: 17px;
    opacity: 1;
    z-index: 12;
}

.bubble .close:hover {
    opacity: 0.6;
}

.bubble .close:before,
.close:after {
    position: absolute;
    left: 4px;
    content: ' ';
    height: 17px;
    width: 2px;
    background-color: #fff;
}

.bubble .close:before {
    transform: rotate(45deg);
}

.bubble .close:after {
    transform: rotate(-45deg);
}

.bubble .bubble--flex {
    display: flex;
    align-items: center;
}

.bubble .bubble--flex--vertical {
    flex-direction: column;
}

.bubble .bubbleChart {
    vertical-align: top;
}

.bubble button.glo {
    color: #00c6ff;
    padding: 10px 20px;
    width: 150px;
    text-decoration: none;
    text-align: center;
    margin: 20px auto;
    display: block;
    background-image: linear-gradient(to left, transparent, transparent 50%, #00c6ff 50%, #00c6ff);
    background-position: 100% 0;
    background-size: 200% 100%;
    transition: all .25s ease-in;
    font: 400 18px tahoma;
    border: 1px solid #00C6FF;
    cursor: pointer;
}

.bubble button.glo:hover {
    background-position: 0 0;
    color: #fff;
}
</style>