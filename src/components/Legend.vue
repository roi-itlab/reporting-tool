<template>
    <div class='legend-wrapper' :style='style'>
    </div>
</template>
<script>
import * as d3 from 'd3'
import VueTypes from 'vue-types';
export default {
    props: {
        props: VueTypes.shape({
            maxHeight: VueTypes.string,
            borderVis: VueTypes.bool,
            borderColor: VueTypes.string,
            textSize: VueTypes.integer,
            textColor: VueTypes.string,
            legendDataColors: VueTypes.array,
            legendDataLabels: VueTypes.array,
            borderWidth: VueTypes.integer,
            alignment: VueTypes.string,
            padding: VueTypes.integer
        }).def({}).loose,
        alignment: VueTypes.string.def('right'),
        borderVis: VueTypes.bool.def(false),
        borderColor: VueTypes.string.def('red'),
        textSize: VueTypes.integer.def(15),
        textColor: VueTypes.string.def('black'),
        borderWidth: VueTypes.integer.def(2),
        padding: VueTypes.number.def(12)
    },
    name: 'Legend',
    mounted() {
        this.createSvg();
    },
    methods: {
        createSvg() {
            if (!this.props.legendDataLabels) {
                let svg = d3.select('.legend-wrapper')
                    .append('svg')
                    .append('g')
                    .attr("class", "legendTable")
                    .append('text')
                    .text('Нет данных!')
                    .attr('transform', 'translate(100,75)')

                return;
            }

            let svg;
            let signColor = this.props.legendDataColors ||
                this.legendDataColors;
            let dataText = this.props.legendDataLabels ||
                this.legendDataLabels;

            let borderVis = this.props.borderVis | this.borderVis;
            let textSize = this.props.textSize || this.textSize;
            let textColor = this.props.textColor || this.textColor;
            let borderWidth = this.props.borderWidth || this.borderWidth;
            let borderColor = this.props.borderColor || this.borderColor;
            let padding = this.props.padding || this.padding;
            let dataSignVis = true;

            svg = d3.select(this.$el)
                .append('svg')
                .attr('class', 'legend')
                .append('g')
                .attr("class", "legendTable");

            if (borderVis) {
                svg.append('rect')
                    .attr('stroke', borderColor)
                    .attr('class', 'bg')
                    .attr('height', textSize * dataText.length + padding * dataText.length + 2 * borderWidth)
                    .attr('fill-opacity', 0.0)
                    .attr("transform", () => {
                        return "translate(" + borderWidth + "," +
                            borderWidth + ")";
                    })
                    .attr('stroke-width', borderWidth)
                    .attr('rx', 5)
                    .attr('ry', 5);
            }

            if (dataSignVis) {
                svg.selectAll('.sign')
                    .data(signColor)
                    .enter().append("rect")
                    .attr('width', textSize)
                    .attr('height', textSize)
                    .attr('m', padding)
                    .attr('fill', d => d)
                    .attr("transform", (d, i, nodes) => {
                        return "translate(" + (+nodes[i].getAttribute('m')) +
                            ',' + (+nodes[i].getAttribute('height') * (i) +
                                (+nodes[i].getAttribute('m')) * (i + 1)) + ")";
                    });
            }

            let maxTextWidth = 0;
            svg.selectAll('.text')
                .data(dataText)
                .enter()
                .append('text')
                .attr('class', 'text')
                .attr('fill', textColor)
                .attr('font-size', textSize)
                .attr('m', padding)
                .text(d => d)
                .attr('l', (d, i, nodes) => {
                    if (nodes[i].getComputedTextLength() > maxTextWidth) {
                        maxTextWidth = nodes[i].getComputedTextLength();
                    }
                    return nodes[i].getComputedTextLength();
                })
                .attr("transform", (d, i, nodes) => {
                    let x = (+nodes[i].getAttribute('m') * 2) +
                        (+nodes[i].getAttribute('font-size'));
                    let y = (+nodes[i].getAttribute('m')) * (i + 1) +
                        (+nodes[i].getAttribute('font-size')) * i +
                        (+nodes[i].getAttribute('font-size'));
                    return "translate(" + x + ',' + y + ")";
                });

            let height = dataText.length * textSize + padding *
                (dataText.length + 1);
            let width = maxTextWidth + padding * 3 + textSize;

            svg.attr('height', height)
                .attr('width', width);

            d3.select(this.$el)
                .selectAll('.bg')
                .attr('width', width)
                .attr('height', height);

            d3.select(this.$el)
                .selectAll('.legend')
                .attr('width', width + borderWidth * 2)
                .attr('height', height + borderWidth * 2);
        }
    },
    computed: {
        style() {
            let style = {};
            let align = this.props.alignment || this.alignment;
            if (this.props.maxHeight) {
                style['max-height'] = this.props.maxHeight;
                style['padding-right'] = '20px';
            }
            if (typeof align === 'string' || align instanceof String) {
                if (align.localeCompare(
                        'top',
                        'en', { sensitivity: 'base' }) === 0) {
                    style['margin-bottom'] = '20px';
                    style['order'] = '-1';
                } else if (align.localeCompare(
                        'right',
                        'en', { sensitivity: 'base' }) === 0) {
                    style['margin-left'] = '20px';
                } else if (align.localeCompare(
                        'bottom',
                        'en', { sensitivity: 'base' }) === 0) {
                    style['margin-top'] = '20px';
                } else if (align.localeCompare(
                        'left',
                        'en', { sensitivity: 'base' }) === 0) {
                    style['margin-right'] = '20px';
                    style['order'] = '-1';
                }
            }
            return style;
        }
    }
}
</script>
<style>
.legend-wrapper {
    display: inline-block;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>