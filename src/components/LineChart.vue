<template>
  <div ref="chart"></div>
</template>

<script>
import { getFirebase } from "../services/firebase.js";
import ApexCharts from "apexcharts";

export default {
  props: {
    collection: {
      type: String,
      default: "engagements",
    },
    firebase: {
      type: Object,
      default: () => {
        return getFirebase();
      },
    },
    width: {
      type: String,
      default: "450",
    },
  },
  data() {
    return {
      data: [],
      options: {
        chart: {
          type: "line",
          toolbar: {
            show: false,
          },
          width: this.width,
        },
        xaxis: {
          type: "datetime",
          tickAmount: 7,
        },
        stroke: {
          show: true,
          curve: "smooth",
        },

        series: [
          {
            name: "Interactions",
            data: [],
          },
        ],
        tooltip: {
          enabled: true,
          followCursor: true,
          y: {
            formatter: function (val) {
              return val + " interactions";
            },
          },
        },
      },
    };
  },
  mounted() {
    this.initializeChart();
  },
  methods: {
    initializeChart() {
      // Create an array of dates for the last 7 days
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        dates.push(date.toDateString());
      }

      // Listen for changes to the last 7 days of data
      const end = Date.now();
      const start = end - 7 * 24 * 60 * 60 * 1000;
      const db = this.firebase.firestore();
      const query = db
        .collection("engagements")
        .where("timeStamp", ">=", start)
        .where("timeStamp", "<=", end);
      query.onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          const timestamp = doc.data().timeStamp;
          const date = new Date(timestamp);
          const day = date.toDateString();
          const count = 1;
          const existing = data.find((d) => d.x === day);
          if (existing) {
            existing.y += count;
          } else {
            data.push({ x: day, y: count });
          }
        });
        // Merge the dates array with the data array
        const merged = [];
        for (const date of dates) {
          const existing = data.find((d) => d.x === date);
          if (existing) {
            merged.push(existing);
          } else {
            merged.push({ x: date, y: 0 });
          }
        }
        this.data = merged;
        this.updateChart();
      });
    },
    updateChart() {
      if (!this.chart) {
        this.chart = new ApexCharts(this.$refs.chart, this.options);
        this.chart.render();
        this.chart.updateSeries([{ data: this.data }]);
      } else {
        this.chart.updateSeries([{ data: this.data }]);
      }
    },
  },
};
</script>
