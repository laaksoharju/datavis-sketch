<template>
  <div class="outer-wrapper">
    <div class="line-chart-wrapper">
      Test positivity over time for postal code {{postcode?postcode:'&lt;click in the chart above to choose&gt;'}}
      <svg :viewBox="viewBox">
        <g id="grid-y" transform="translate(30,10)">
        </g>
        <g class="axis" id="axis-x" transform="translate(30,200)">
        </g>
        <g class="axis" id="axis-y" transform="translate(30,10)">
        </g>
        <g transform="translate(30, 10)" id="chart">
            <path
              class="line-chart-line"
              :d="points"
            />
        </g>
      </svg>
    </div>
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
      xScale: null,
      yScale: null,
      transitionDuration: 1000
    }
  }, 
  watch: {
    data: function (newVals) {
      this.xScale = d3.scaleLinear()
                      .domain(d3.extent(newVals, (d, i) => i))
                      .range(this.rangeX)
      this.yScale = d3.scaleLinear()
                      .domain([0, d3.max(newVals, d => d)])
                      .range(this.rangeY)
      TweenLite.to(this.$data, this.transitionDuration/1000, {points: this.drawGraph(newVals)})
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
    drawGraph: function(data) {
      d3.select("#grid-y")
        .transition()
        .duration(this.transitionDuration)
        .call(d3.axisLeft(this.yScale).ticks(5).tickSize(-this.width).tickFormat(""));
      d3.select("#axis-x")
        .transition()
        .duration(this.transitionDuration)
        .call(d3.axisBottom(this.xScale).tickFormat(d => "w " + (+(d+25)%53+1)));
      d3.select("#axis-y")
        .transition()
        .duration(this.transitionDuration)
        .call(d3.axisLeft(this.yScale).ticks(5).tickFormat(d => d*100+"%"));
      return this.path()(data);
    },
    path: function() {
      return d3.line()
        .x((d, i) => this.xScale(i))
        .y(d => this.yScale(d));
    },
  }
}
</script>
<style>

.outer-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.line-chart-wrapper {
  background-color: gainsboro;
  max-width: 1500px;
  width:100%;
  padding: 0 10px;
}
.line-chart-line {
    transition: 1s;
    fill: none;
    stroke: firebrick;
    stroke-width: 3px;
}
.values-move {
  transition: transform 1s;
}

#grid-y line {
  stroke: darkgray;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

#grid-y path {
  stroke-width: 0;
}

</style>
