<template>
  <Line class="uk-position-relative" v-if="chartData" id="sensor-chart" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  name: "Linechart",
  components: {
    Line
  },
  props: {
    chartData: {
      type: Object,
      default: null
    }
  },
  data(){
    return {
      demoData: {
        labels: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
        datasets: [
          {
            label: 'Temperatur',
            data: [23, 22, 16, 30, 24, 22, 26],
            fill: false,
            borderColor: 'rgb(169,34,34)',
            tension: 0.1
          },
          {
            label: 'Luftfeuchtigkeit',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio:2.35,
        scales: {
          y: {
            ticks:{
              color: 'white',
              font: {
                size: 14
              }
            }
          },
          x: {
            ticks:{
              color: 'white',
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgb(238,238,238)'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {

              }
            }
          },

        }
      }
    }
  },
  mounted() {
    console.log(this.chartData);
  }
}
</script>

<style scoped>

</style>