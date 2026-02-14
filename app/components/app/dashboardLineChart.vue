<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from 'chart.js';
import { Line } from 'vue-chartjs';

// Register only the components we need (Tree-shaking)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  data: number[];
  labels: string[];
}

const props = defineProps<Props>();

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: '#10b981', // Tailwind green-500
      borderColor: '#10b981',
      data: props.data,
      tension: 0.4, // Smoothing the line
      pointRadius: 4,
    }
  ]
}));

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111827', // Tailwind gray-900
      titleColor: '#fff',
      bodyColor: '#9ca3af'
    }
  },
  scales: {
    y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
    x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
  }
};
</script>

<template>
  <div class="h-[300px] w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>