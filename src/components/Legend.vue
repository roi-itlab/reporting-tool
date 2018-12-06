<template>
    <div class='legend'>
    </div>
</template>

<script>
  import * as d3 from 'd3'
  import VueTypes from 'vue-types';
  export default {
    props: {
      props : VueTypes.shape({
        borderVis: VueTypes.bool,
        borderColor: VueTypes.string,
        textSize: VueTypes.integer,
        textColor: VueTypes.string,
        legendDataColors: VueTypes.array,
        legendDataLabels: VueTypes.array,
        borderWidth: VueTypes.bool,
        margin: VueTypes.integer,
        dataSignVis: VueTypes.bool,
      }).def({}),

      borderVis: VueTypes.bool.def(false),
      borderColor: VueTypes.string.def('red'),
      textSize: VueTypes.integer.def(15),
      textColor: VueTypes.string.def('black'),
      borderWidth: VueTypes.integer.def(2),
      margin: VueTypes.number.def(8),
      dataSignVis: VueTypes.bool.def(false),
    },
    name: 'Legend',
    mounted: function() {
      this.createSvg()
    },
    methods: {
      createSvg() {
        if (!this.props.legendDataLabels) {
          let svg = d3.select('.legend')
            .append('svg')
            .append('g')
            .attr("class", "legendTable")
            .append('text')
            .text('Нет данных!')
            .attr('transform', 'translate(100,75)')
          return
        }
        let svg
        let signColor = this.props.legendDataColors || this.legendDataColors
        let dataText = this.props.legendDataLabels  || this.legendDataLabels

        let borderVis = this.props.borderVis | this.borderVis
        let textSize = this.props.textSize || this.textSize
        let textColor = this.props.textColor || this.textColor
        let borderWidth = this.props.borderWidth || this.borderWidth
        let borderColor = this.props.borderColor || this.borderColor
        let margin = this.props.margin || this.margin
        let dataSignVis = this.props.dataSignVis | this.dataSignVis

        svg = d3.select('.legend')
          .append('svg')
          .attr('class', 'legend')
          .append('g')
          .attr("class", "legendTable")
        if (borderVis) {
          svg.append('rect').attr('stroke', borderColor).attr('class', 'bg')
            .attr('height', textSize * dataText.length + margin * dataText.length + 2 * borderWidth)
            .attr('fill-opacity', 0.0)
            .attr("transform", () => {
              return "translate(" + borderWidth + "," + borderWidth + ")"
            })
            .attr('stroke-width', borderWidth).attr('rx', 5).attr('ry', 5)
        }
        if (dataSignVis) {
          svg.selectAll('.sign')
            .data(signColor)
            .enter().append("rect")
            .attr('width', textSize)
            .attr('height', textSize)
            .attr('m', margin)
            .attr('fill', function (d, i) {
              return d
            })
            .attr("transform", function (d, i) {
              return "translate(" + +this.getAttribute('m') + ','
                + (+this.getAttribute('height') * (i) + +this.getAttribute('m') * (i + 1)) + ")"
            })
        }
        svg.selectAll('.text')
          .data(dataText)
          .enter().append('text')
          .attr('class', 'text')
          .attr('fill', textColor)
          .attr('size', textSize)
          .attr('m', margin)
          .text(function (d, i) {
            return d
          })
          .attr('l', function (d,i) {
            return this.getComputedTextLength()
          })
          .attr("transform", function(d, i) {
            let x = (+this.getAttribute('m') * 2) + (+this.getAttribute('size'))
            let y = (+this.getAttribute('m') * (i + 1)) + (+this.getAttribute('size') * (i) + +this.getAttribute('size'))
            return "translate(" + x + ',' + y + ")";
          })

        let texts = document.getElementsByClassName('text')
        let textPixelLength = 0
        for (var text of texts) {
          if (+text.getAttribute('l') > textPixelLength)
            textPixelLength = +text.getAttribute('l')
        }
        let height = dataText.length * textSize + margin * (dataText.length + 1)
        let width =  textPixelLength + margin * 3 + textSize
        svg.attr('height', height ).attr('width', width)
        d3.selectAll('.bg').attr('width', width).attr('height', height)
        d3.selectAll('.legend').attr('width', width + borderWidth * 2).attr('height', height + borderWidth * 2 )
      }
    }
  }
</script>
