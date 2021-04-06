<template>
  <div class="home">
    <Chart :data="data"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Chart from '@/components/Chart.vue'
import io from 'socket.io-client'

export default {
  name: 'Panel',
  components: {
    Chart
  },
  data: function() {
    return {
      data: null
    }
  },
  created: function() {
    const socket = io();
    socket.emit('siteLoaded');
    socket.on('allData', function (d) {
      let perArea = {};
      for (const row of d) {
        if (row.postnummer >= 74192 && row.postnummer <= 75756) {
        if (typeof perArea[row.postnummer] === 'undefined')
            perArea[row.postnummer] = {pop: row.population, tests: []};
          perArea[row.postnummer].tests.push({week: row.week, tests: row.test_per_capita_1w5, cases: row.cases_per_capita_2w5, pos: row.positivity_1w});
        }
      }
      this.data =perArea;
    }.bind(this));
  }
}
</script>
