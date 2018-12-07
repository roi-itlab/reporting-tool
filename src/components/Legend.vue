<template>
    <div class='legendWrapper' :style='style'>
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
            borderWidth: VueTypes.bool,
            margin: VueTypes.integer,
            dataSignVis: VueTypes.bool,
        }).def({}).loose,

        borderVis: VueTypes.bool.def(false),
        borderColor: VueTypes.string.def('red'),
        textSize: VueTypes.integer.def(15),
        textColor: VueTypes.string.def('black'),
        borderWidth: VueTypes.integer.def(2),
        margin: VueTypes.number.def(8),
        dataSignVis: VueTypes.bool.def(false),
    },
    name: 'Legend',
    mounted() {
        this.createSvg();
    },
    methods: {
        createSvg() {
            if (!this.props.legendDataLabels) {
                let svg = d3.select('.legendWrapper')
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
            let margin = this.props.margin || this.margin;
            let dataSignVis = this.props.dataSignVis | this.dataSignVis;

            svg = d3.select(this.$el)
                .append('svg')
                .attr('class', 'legend')
                .append('g')
                .attr("class", "legendTable");

            if (borderVis) {
                svg.append('rect')
                    .attr('stroke', borderColor)
                    .attr('class', 'bg')
                    .attr('height', textSize * dataText.length + margin * dataText.length + 2 * borderWidth)
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
                    .attr('m', margin)
                    .attr('fill', d => d)
                    .attr("transform", (d, i, nodes) => {
                        return "translate(" + (+nodes[i].getAttribute('m')) +
                            ',' + (+nodes[i].getAttribute('height') * (i) +
                                (+nodes[i].getAttribute('m')) * (i + 1)) + ")";
                    });
            }

            svg.selectAll('.text')
                .data(dataText)
                .enter()
                .append('text')
                .attr('class', 'text')
                .attr('fill', textColor)
                .attr('size', textSize)
                .attr('m', margin)
                .text(d => d)
                .attr('l', (d, i, nodes) => nodes[i].getComputedTextLength())
                .attr("transform", (d, i, nodes) => {
                    let x = (+nodes[i].getAttribute('m') * 2) +
                        (+nodes[i].getAttribute('size'));
                    let y = (+nodes[i].getAttribute('m')) * (i + 1) +
                        (+nodes[i].getAttribute('size')) * i +
                        (+nodes[i].getAttribute('size'));
                    return "translate(" + x + ',' + y + ")";
                });

            let texts = document.getElementsByClassName('text');
            let textPixelLength = 0;
            for (let text of texts) {
                if (+text.getAttribute('l') > textPixelLength)
                    textPixelLength = +text.getAttribute('l');
            }
            let height = dataText.length * textSize + margin *
                (dataText.length + 1);
            let width = textPixelLength + margin * 3 + textSize;

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
            if (this.props.maxHeight) {
                style['max-height'] = this.props.maxHeight;
                style['padding-right'] = '20px';
            }
            return style;
        }
    }
}
</script>
<style>
.legendWrapper {
    display: inline-block;
    margin: 0 20px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>