<template>
  <div class="wrapper">
    {{postcode}}
    <svg :viewBox="viewBox">
      <g transform="translate(30, 10)" id="chart">
          <path
            class="line-chart-line"
            :d="points"
          />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import TweenLite from 'gsap';

export default {
  name: 'LineChart',
  props: {
    data: Array,
    postcode: String
  },
  data: function () {
    return {
      width: 1500,
      height: 220,
      padding: 30,
      points: {},
    }
  }, 
  watch: {
    data: function (newVals) {
      const vm = this;
      console.log(this.line)
      TweenLite.to(this.$data, 1, {points: vm.drawLine(newVals)})
    }
  },
  computed: {
    rangeX: function () {
      const width = this.width - this.padding;
      return [0, width];
    },
    rangeY: function() {
      const height = this.height - this.padding;
      return [height, 0];
    },
    viewBox: function() {
      return `0 0 ${this.width} ${this.height}`;
    }
  },
  methods: {
    drawLine: function(data) {
      //console.log(this.path(data));
      return this.path()(data);
    },
    path: function() {
      const x = d3.scaleLinear().domain([26,65]).range(this.rangeX);
      const y = d3.scaleLinear().domain([0,d3.max(this.data)*100]).range(this.rangeY);
      d3.select("#chart").append("g").attr("transform", "translate(0,190)").call(d3.axisBottom().scale(x));
      d3.select("#chart").append("g").attr("transform", "translate(0,0)").call(d3.axisLeft().scale(y));
      x.domain(d3.extent(this.data, (d, i) => i));
      y.domain([0, d3.max(this.data, d => d)]);
      return d3.line()
        .x((d, i) => x(i))
        .y(d => y(d));
    },
  }
}
</script>
<style scoped>

.wrapper {
  background-color: lightgray
}
.line-chart-line {
    transition: 1s;
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px;
}
.values-move {
  transition: transform 1s;
}
</style>
