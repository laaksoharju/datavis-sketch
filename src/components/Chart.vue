<template>
  <div class="page-wrapper">
    <div class="chart-wrapper">
      <div class="chart">
        <div class="row" v-for="(area, key) in data" @click="setCurrent(key)" :style="{height : colHeight+'px', width : area.pop/160+'px'}" :key="key">
          <div v-for="(row, index) in area.tests" :title="'' + (key.substring(0,3)) + ' ' + (key.substring(3)) + '\npop: ' + area.pop + '\nweek ' + ((row.week-1)%53+1) + '\npositivity: ' + (row.pos*100).toFixed(1) + '%'" :style="{'background-color': colorScale(row.pos)}" :class="{'highlight': currentLine === key }" :key="index">   
          </div>
        </div>
      </div>
    </div>
    <LineChart :data="getLineData()" :postcode="currentLine" :population="currentPopulation"/>
  </div>
</template>

<script>
import {interpolateRdYlGn} from 'd3-scale-chromatic';
import {scalePow} from 'd3-scale';
import LineChart from '@/components/LineChart.vue'

export default {
  name: 'Chart',
  components: {
    LineChart
  },
  props: {
    data: Object
  },
  data: function () {
    return {
      currentLine: null,
      currentPopulation: null,
    }
  },
  computed: {
    colHeight: function () {
      return this.data[Object.keys(this.data)[0]].tests.length*15+10;
    }
  },
  methods: {
    colorScale: function (c) {
      if (c === "NA")
        return "white"
      let p = scalePow()
        .exponent(1/5)
        .range([1, 0])
      return interpolateRdYlGn(p(c+0.005));

      // LOFI version
      // if (c < 0.01)
      //   return "lime"
      // if (c < 0.05)
      //   return "yellowgreen"
      // if (c < 0.1)
      //   return "gold"
      // if (c < 0.20)
      //   return "orange"
      // if (c < 0.30)
      //   return "orangered"
      // return "firebrick"

    },
    setCurrent: function(pnr) {
      this.currentLine = pnr;
      this.currentPopulation = this.data[pnr].pop;
    },
    getLineData: function () {
      if (this.currentLine != null)
        return this.data[this.currentLine].tests.map(d => d.pos==='NA'?0:d.pos)
      return []
    }

  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
.chart-wrapper {
  width:100%;
  overflow-x:scroll;
  overflow-y: hidden;
}
.chart {
  width:2100px;
}
.row {
  display: inline-grid;
  grid-template-rows: repeat(auto-fill, 15px);
  overflow: hidden;
  cursor: pointer;
  border-top:10px solid white;
}
.row div {
  overflow: hidden;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
}

.highlight {
  border-left: 1px solid black;
  border-right: 1px solid black !important;
}

.highlight:first-child {
  border-top: 1px solid black;
}

.highlight:last-child {
  border-bottom: 1px solid black;
}

.page-wrapper {
  display: grid;
  grid-template-rows: auto 250px;
}
</style>
