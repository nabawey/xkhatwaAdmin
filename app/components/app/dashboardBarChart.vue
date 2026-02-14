<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{ data: number[], labels: string[] }>();

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.labels,
  datasets: [{
    data: props.data,
    backgroundColor: '#3b82f6', // Tailwind blue-500
    borderRadius: 6,
    borderSkipped: false,
  }]
}));

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#1f2937' }, ticks: { display: false } },
    x: { grid: { display: false }, ticks: { color: '#6b7280' } }
  }
};
</script>

<template>
  <div class="h-[300px] w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>