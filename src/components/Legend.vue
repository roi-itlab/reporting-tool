<template>
    <div id='legend'>
    </div>
</template>

<script>
  import * as d3 from 'd3'
  export default {
    props: {
      orientation:{
        default: 'vertical',
        type: String
      },
      borderVis: {
        default: false,
        type: Boolean
      },
      borderColor: {
        default: 'red',
        type: String
      },
      signType: {
        default: 'rect',
        type: String
      },
      textSize: {
        default: 15,
        type: Number
      },
      textColor: {
        default: 'black',
        type: String
      },
      textSituated: {
        default: 'top',
        type: String
      },
      legendData: {
        default: function () {
          return { labels: ['Сбербанк', 'Альфабанк', 'Тинькофф'], colors: ['green', 'red', 'yellow']}
        }
      },
      borderWidth: {
        default: 2,
        type: Number
      },
      margin: {
        default: 8,
        type: Number
      }
    },
    name: 'Legend',
    mounted: function() {
      this.createSvg()
    },
    methods: {
      createSvg() {
        let svg

        let signColor = this.legendData.colors
        let dataText = this.legendData.labels

        svg = d3.select('#legend')
          .append('svg')
          .attr('class', 'legend')
          .append('g')
          .attr("class", "legendTable")

        if (this.borderVis) {
          svg.append('rect').attr('stroke', this.borderColor).attr('class', 'bg')
            .attr('height', this.textSize * dataText.length + this.margin * dataText.length + 2 * this.borderWidth)
            .attr('fill-opacity', 0.0)
            .attr("transform", () => {
              return "translate(" + this.borderWidth + "," + this.borderWidth + ")"
            })
            .attr('stroke-width', this.borderWidth).attr('rx', 5).attr('ry', 5)
        }



        svg.selectAll('.sign')
          .data(signColor)
          .enter().append("rect")
          .attr('width', this.textSize)
          .attr('height', this.textSize)
          .attr('m', this.margin)
          // .attr('o', this.orientation)
          // .attr('s', this.textSituated)
          .attr('fill', function (d,i) {
            return d
          })
          .attr("transform", function(d, i) {
                // if(this.getAttribute('o') === 'vertical') {
                  return "translate(" + +this.getAttribute('m') + ','
                    + (+this.getAttribute('height') * (i) + +this.getAttribute('m') * (i + 1)) + ")"
                // }
                // if (this.getAttribute('o') === 'horizontal'){
                //   return "translate(" + +this.getAttribute('m') * (i + 1) + (+this.getAttribute('height') * (i)+','
                //     + +this.getAttribute('m') + ")")
                // }
              })


        svg.selectAll('.text')
          .data(dataText)
          .enter().append('text')
          .attr('class', 'text')
          .attr('size', this.textSize)
          .attr('m', this.margin)
          // .attr('o', this.orientation)
          // .attr('s', this.textSituated)
          .text(function (d, i) {
            return d
          })
          .attr('l', function (d,i) {
            return this.clientWidth
          })
          .attr("transform", function(d, i) {
            let x = (+this.getAttribute('m') * 2) + (+this.getAttribute('size'))
            let y = (+this.getAttribute('m') * (i + 1)) + (+this.getAttribute('size') * (i) + +this.getAttribute('size'))
            return "translate(" + x + ',' + y + ")";

          })

        let texts = document.getElementsByClassName('text')
        let textPixelLength = 0
        for (var text of texts) {
          console.log(+text.getAttribute('l'))
          if (+text.getAttribute('l') > textPixelLength)
            textPixelLength = +text.getAttribute('l')
        }


        let height = dataText.length * this.textSize + this.margin * (dataText.length + 1)
        let width =  textPixelLength + this.margin * 3 + this.textSize

        svg.attr('height', height ).attr('width', width)
        d3.selectAll('.bg').attr('width', width).attr('height', height)
        d3.selectAll('.legend').attr('width', width + this.borderWidth * 2).attr('height', height + this.borderWidth * 2 )
      }
    }
  }
</script>
