<template>
  <div id="app">
    <BarChart :width_chart="900" :height_chart ="300" :props='barConfig'></BarChart>
      <!--ни к чему не привязан - плохой -->
     <!-- <GroupedBarChart2></GroupedBarChart2>-->
      <!--хороший-->
       <GroupedBarChart :width_chart = "900" :height_chart="500" :props='groupbarConfig'></GroupedBarChart>
     <StackedBarChart :width_chart = "900" :height_chart="500" :props='stackbarConfig'></StackedBarChart>
  </div>
</template>

<script>
import BarChart from './components/BarChart'
import Legend from './components/Legend'
import GroupedBarChart from './components/GroupedBarChart'
import GroupedBarChart2 from './components/GroupedBarChart2'
import StackedBarChart from './components/StackedBarChart'
export default {
  name: 'App',
  components: {
    BarChart,
    Legend,
    GroupedBarChart,
    GroupedBarChart2,
    StackedBarChart
  },
  data() {
    return {
      barConfig: {
        labelKey: 'name',
        valueKey: 'avg_spawns',
        colorscheme: this.getColorScheme('set1'),
        titleColor: this.getColorScheme('set1')[7],
        displayLegend: true,
        legendConfig: {
            scroll: true,
            alignment: 'right',
            borderVis: true,
            borderColor: 'green',
            textColor: 'black',
            textSize: 15,
            padding: 15,
            dataSignVis: true
        }
        },
      groupbarConfig: {
        labelKey: 'name',
        valueKey: 'avg_spawns',
        colorscheme: this.getColorScheme('set1'),
        titleColor: this.getColorScheme('set1')[7],
        displayLegend: true,
        legendConfig: {
            scroll: true,
            alignment: 'right',
            borderVis: true,
            borderColor: 'purple',
            textColor: 'black',
            textSize: 15,
            padding: 15,
            dataSignVis: true
        }
        },
        stackbarConfig: {
        labelKey: 'name',
        valueKey: 'avg_spawns',
        colorscheme: this.getColorScheme('set1'),
        titleColor: this.getColorScheme('set1')[7],
        displayLegend: true,
        legendConfig: {
            scroll: true,
            alignment: 'right',
            borderVis: true,
            borderColor: 'purple',
            textColor: 'black',
            textSize: 15,
            padding: 15,
            dataSignVis: true
        }
      }
  }
},
methods: {
    getColorScheme(scheme) {
      let colorSchemes = {
        blues: ['#f7fbff','#e3eef9','#cfe1f2','#b5d4e9','#93c3df','#6daed5','#4b97c9','#2f7ebc','#1864aa','#0a4a90','#08306b'],
        greens: ['#f7fcf5','#e8f6e3','#d3eecd','#b7e2b1','#97d494','#73c378','#4daf62','#2f984f','#157f3b','#036429','#00441b'],
        greys: ['#ffffff','#f2f2f2','#e2e2e2','#cecece','#b4b4b4','#979797','#7a7a7a','#5f5f5f','#404040','#1e1e1e','#000000'],
        oranges: ['#fff5eb','#fee8d3','#fdd8b3','#fdc28c','#fda762','#fb8d3d','#f2701d','#e25609','#c44103','#9f3303','#7f2704'],
        purples: ['#fcfbfd','#f1eff6','#e2e1ef','#cecee5','#b6b5d8','#9e9bc9','#8782bc','#7363ac','#61409b','#501f8c','#3f007d'],
        reds: ['#fff5f0','#fee3d6','#fdc9b4','#fcaa8e','#fc8a6b','#f9694c','#ef4533','#d92723','#bb151a','#970b13','#67000d'],
        viridis: ['#440154','#482475','#414487','#355f8d','#2a788e','#21918c','#22a884','#44bf70','#7ad151','#bddf26','#fde725'],
        inferno: ['#000004','#160b39','#420a68','#6a176e','#932667','#bc3754','#dd513a','#f37819','#fca50a','#f6d746','#fcffa4'],
        magma: ['#000004','#140e36','#3b0f70','#641a80','#8c2981','#b73779','#de4968','#f7705c','#fe9f6d','#fecf92','#fcfdbf'],
        plasma: ['#0d0887','#41049d','#6a00a8','#8f0da4','#b12a90','#cc4778','#e16462','#f2844b','#fca636','#fcce25','#f0f921'],
        warm: ['#6e40aa','#963db3','#bf3caf','#e4419d','#fe4b83','#ff5e63','#ff7847','#fb9633','#e2b72f','#c6d63c','#aff05b'],
        cool: ['#6e40aa','#6054c8','#4c6edb','#368ce1','#23abd8','#1ac7c2','#1ddfa3','#30ef82','#52f667','#7ff658','#aff05b'],
        rainbow: ['#6e40aa','#bf3caf','#fe4b83','#ff7847','#e2b72f','#aff05b','#52f667','#1ddfa3','#23abd8','#4c6edb','#6e40aa'],
        category10: ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf'],
        accent: ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666'],
        pastel1: ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec','#f2f2f2'],
        pastel2: ['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc','#cccccc'],
        set1: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
      };
      return colorSchemes[scheme];
    }
}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
