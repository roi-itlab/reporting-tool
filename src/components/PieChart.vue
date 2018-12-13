<template>
    <div class='pie'>
        <div class='pie--title' v-if='title' :style=titleStyle>{{ title }}</div>
        <div class='pie--flex' :class='{ "pie--flex--vertical": flexStyle }'>
            <div class='pie--chart'></div>
            <Legend class='pie--legend' v-if='legendReady' :props='props.legendConfig'></Legend>
        </div>
    </div>
</template>
<script>
import PostsService from '@/services/PostsService';
import VueTypes from 'vue-types';
import * as d3 from 'd3';
import Legend from './Legend';

export default {
    name: 'PieChart',
    components: { Legend },
    props: {
        props: VueTypes.shape({
            serverConfig: VueTypes.string.isRequired,
            labelKey: VueTypes.string.isRequired,
            valueKey: VueTypes.string.isRequired,
            outerRadius: VueTypes.number.isRequired,
            innerRadius: VueTypes.number,
            strokeWidth: VueTypes.number,
            strokeColor: VueTypes.string,
            arcPadding: VueTypes.number,
            grouping: VueTypes.bool,
            groupingThreshold: VueTypes.number,
            colorscheme: VueTypes.array,
            title: VueTypes.string,
            titleSize: VueTypes.string,
            titleColor: VueTypes.string,
            displayLegend: VueTypes.bool,
            legendConfig: VueTypes.object
        }),
        innerRadius: VueTypes.number.def(0),
        strokeWidth: VueTypes.number.def(0),
        strokeColor: VueTypes.string.def('black'),
        arcPadding: VueTypes.number.def(0),
        grouping: VueTypes.bool.def(false),
        groupingThreshold: VueTypes.number.def(0),
        colorscheme: VueTypes.array.def(d3.schemeSet1),
        titleSize: VueTypes.string.def('2em'),
        titleColor: VueTypes.string.def('black'),
        displayLegend: VueTypes.bool.def(true),
        legendConfig: VueTypes.object.def({})
    },
    data() {
        return {
            title: '',
            items: [],
            legendData: {
                labels: [],
                colors: []
            },
            legendReady: false
        }
    },
    methods: {
        async getQuery() {
            const response = await PostsService.fetchQuery(this.props.serverConfig);
            return response;
        },
        updateData() {
            this.getQuery().then(response => {
                this.items = response.data[0];
                this.createSVG();
            })
        },
        createSVG() {
            let innerRadius = this.props.innerRadius || this.innerRadius;
            let strokeWidth = this.props.strokeWidth || this.strokeWidth;
            let strokeColor = this.props.strokeColor || this.strokeColor;
            let arcPadding = this.props.arcPadding || this.arcPadding;
            let colorscheme = this.props.colorscheme || this.colorscheme;
            let legendConfig = this.props.legendConfig || this.legendConfig;
            let displayLegend = this.props.displayLegend;
            let grouping = this.props.grouping;

            if (displayLegend === undefined) {
                displayLegend = this.displayLegend;
            }

            if (grouping === undefined) {
                grouping = this.grouping;
            }

            if (grouping) {
                this.groupItems();
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

            let sum = 0;
            let tooltipTimerID = 0;
            let color = d3.scaleOrdinal(colorscheme);
            let size = this.props.outerRadius * 2 + arcPadding * 2 + strokeWidth * 2;

            let svg = d3.select(this.$el)
                .select('.pie--chart')
                .append('svg')
                .attr('width', size)
                .attr('height', size);

            let g = svg.append('g')
                .attr(
                    'transform',
                    'translate(' + (size / 2) + ',' + (size / 2) + ')'
                );

            let arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(this.props.outerRadius);

            let pie = d3.pie()
                .value(d => parseFloat(d[this.props.valueKey]))
                .sort(null);

            let path = g.selectAll('path')
                .data(pie(this.items))
                .enter()
                .each((sct, i) => {
                    sum += sct.value;
                    this.legendData.labels[i] = sct.data[this.props.labelKey];
                    this.legendData.colors[i] = color(i);
                })
                .append('g')
                .attr('id', (sct, i) => 'sector' + i)
                .on('click', (sct, i) => {
                    d3.selectAll('.pie--chart__tooltip').remove();
                    if (tooltipTimerID) {
                        clearTimeout(tooltipTimerID);
                        tooltipTimerID = 0;
                    }

                    let tooltip = d3.select(this.$el)
                        .select('.pie--chart')
                        .append('div')
                        .attr('class', 'pie--chart__tooltip')
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY + 'px')
                        .style('display', 'block');

                    tooltip.append('div')
                        .attr('class', 'pie--chart__label')
                        .text(sct.data[this.props.labelKey]);

                    tooltip.append('div')
                        .text(this.roundValue(sct.value));

                    tooltip.append('div')
                        .text(this.toPercent(sct.value, sum));
                })
                .on('mouseout', () => {
                    if (!tooltipTimerID) {
                        tooltipTimerID = setTimeout(() => {
                            d3.selectAll('.pie--chart__tooltip').remove();
                        }, 1000)
                    }
                })
                .append('path')
                .attr('d', arc)
                .attr('stroke', strokeColor)
                .attr('stroke-width', strokeWidth)
                .attr('fill', (sct, i) => this.legendData.colors[i])
                .attr('opacity', '1')
                .attr('transform', sct => {
                    sct.midAngle = (sct.endAngle - sct.startAngle) / 2 +
                        sct.startAngle;
                    let x = Math.sin(sct.midAngle) * arcPadding;
                    let y = -Math.cos(sct.midAngle) * arcPadding;
                    return 'translate(' + x + ',' + y + ')';
                })
                .on('mouseover', (sct, i, nodes) => {
                    d3.select(nodes[i])
                        .style('cursor', 'pointer')
                        .attr('opacity', '0.7');
                })
                .on('mouseout', (sct, i, nodes) => {
                    d3.select(nodes[i])
                        .style('cursor', 'none')
                        .attr('opacity', '1');
                });

            if (displayLegend) {
                if (this.props.legendConfig === undefined) {
                    this.props.legendConfig = legendConfig;
                }
                this.props.legendConfig.legendDataColors = this.legendData.colors;
                this.props.legendConfig.legendDataLabels = this.legendData.labels;
                if (this.props.legendConfig.scroll && !this.props.legendConfig.maxHeight) {
                    this.props.legendConfig.maxHeight = size + 'px';
                }
                this.legendReady = true;
            }
        },
        roundValue(value) {
            return +(value.toFixed(2));
        },
        toPercent(value, sum) {
            return this.roundValue(value / sum * 100) + '%';
        },
        groupItems() {
            let value = 0;
            let label = 'Others (< ' + this.props.groupingThreshold + ')';
            let groupingThreshold = this.props.groupingThreshold ||
                this.groupingThreshold;

            for (let i = this.items.length - 1; i >= 0; i--) {
                if (
                    parseFloat(this.items[i][this.props.valueKey]) <
                    parseFloat(groupingThreshold)
                ) {
                    value += parseFloat(this.items[i][this.props.valueKey]);
                    this.items.splice(i, 1);
                }
            }

            this.items.push({
                [this.props.labelKey]: label,
                [this.props.valueKey]: this.roundValue(value)
            });
        }
    },
    mounted() {
        this.updateData();
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
.pie--flex {
    display: flex;
    align-items: center;
}

.pie--flex--vertical {
    flex-direction: column;
}

.pie--title {
    width: 100%;
    font-weight: bold;
    margin-bottom: 20px;
}

.pie--chart {
    display: inline-block;
    vertical-align: top;
}

.pie--chart__tooltip {
    z-index: 10;
    display: none;
    position: absolute;
    padding: 10px;

    min-width: 80px;

    font-size: 12px;
    text-align: center;
    line-height: 140%;
    font-weight: 300;

    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 2px;
    box-shadow: 0 0 5px #999999;
}

.pie--chart__label {
    font-weight: 600;
}
</style>