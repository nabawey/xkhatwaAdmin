<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();

useHead({
  title: t('dashboard.title')
})

// --- Types ---
type TimeRange = 'Last Day' | 'Last Week' | 'Last Month';
type Category = 'All Products' | 'Shoe 01' | 'Shoe 02' | 'Apparel';

// --- Filter State ---
const filters = reactive({
  timeRange: 'Last Week' as TimeRange,
  category: 'All Products' as Category
});

const isUpdating = ref(false);

// --- Mock Data Source ---
const statsDb = {
  'Last Day': {
    customers: 42, conversions: 110, revenue: 12400, orders: 15,
    chartLabels: ['12pm', '3pm', '6pm', '9pm', '12am'],
    chartValues: [2000, 4500, 2100, 3800, 0]
  },
  'Last Week': {
    customers: 984, conversions: 1939, revenue: 239668, orders: 283,
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    chartValues: [30000, 45000, 32000, 50000, 42000, 20000, 20668]
  },
  'Last Month': {
    customers: 4500, conversions: 8200, revenue: 1100500, orders: 1200,
    chartLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    chartValues: [250000, 310000, 280000, 260500]
  },
};

const currentData = computed(() => {
  const base = statsDb[filters.timeRange];
  const multiplier = filters.category === 'All Products' ? 1 : 0.4;

  return {
    summary: {
      customers: Math.floor(base.customers * multiplier).toLocaleString(),
      conversions: Math.floor(base.conversions * multiplier).toLocaleString(),
      revenue: `$${Math.floor(base.revenue * multiplier).toLocaleString()}`,
      orders: Math.floor(base.orders * multiplier).toLocaleString(),
    },
    chart: {
      labels: base.chartLabels,
      values: base.chartValues.map(v => v * multiplier)
    }
  };
});

watch([() => filters.timeRange, () => filters.category], () => {
  isUpdating.value = true;
  setTimeout(() => (isUpdating.value = false), 400);
});
</script>

<template>
  <div class="space-y-8 p-1">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
      <div class="flex items-center gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{{ t('dashboard.filter_date') }}</label>
          <select v-model="filters.timeRange"
            class="bg-black border border-gray-700 text-sm text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer hover:border-gray-600 transition-all">
            <option value="Last Day">{{ t('dashboard.time_ranges.day') }}</option>
            <option value="Last Week">{{ t('dashboard.time_ranges.week') }}</option>
            <option value="Last Month">{{ t('dashboard.time_ranges.month') }}</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{{ t('dashboard.products_label') }}</label>
          <select v-model="filters.category"
            class="bg-black border border-gray-700 text-sm text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer hover:border-gray-600 transition-all">
            <option value="All Products">{{ t('dashboard.categories.all') }}</option>
            <option value="Shoe 01">{{ t('dashboard.categories.shoe_01') }}</option>
            <option value="Shoe 02">{{ t('dashboard.categories.shoe_02') }}</option>
            <option value="Apparel">{{ t('dashboard.categories.apparel') }}</option>
          </select>
        </div>
      </div>

      <div v-if="isUpdating" class="flex items-center justify-end">
        <AppLoadingSpinner />
        <span class="p-2 text-xs font-medium text-gray-400 animate-pulse">{{ t('dashboard.syncing') }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all"
      :class="{ 'opacity-50 blur-[2px]': isUpdating }">
      <AppSummaryCard icon="heroicons-outline:user-group" :title="t('dashboard.metrics.customers')" :amount="currentData.summary.customers"
        :difference-percentage="14" :is-positive="false" />
      <AppSummaryCard icon="heroicons-outline:chart-bar" :title="t('dashboard.metrics.conversions')" :amount="currentData.summary.conversions"
        :difference-percentage="5" :is-positive="false" />
      <AppSummaryCard icon="heroicons-outline:currency-dollar" :title="t('dashboard.metrics.revenue')" :amount="currentData.summary.revenue"
        :difference-percentage="5" :is-positive="true" />
      <AppSummaryCard icon="heroicons-outline:shopping-cart" :title="t('dashboard.metrics.orders')" :amount="currentData.summary.orders"
        :difference-percentage="5" :is-positive="false" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-sm font-bold text-white uppercase tracking-widest">{{ t('dashboard.revenue_performance') }}</h3>
          <span class="text-xs text-green-500 font-mono bg-green-500/10 px-2 py-1 rounded">{{ t('dashboard.live_trend') }}</span>
        </div>

        <ClientOnly>
          <AppDashboardLineChart :labels="currentData.chart.labels" :data="currentData.chart.values" />
          <template #fallback>
            <div class="h-[300px] flex items-center justify-center bg-black/20 rounded-lg animate-pulse">
              <span class="text-gray-600 text-sm">{{ t('common.loading') }}</span>
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-6">{{ t('dashboard.order_volume') }}</h3>
        <ClientOnly>
          <AppDashboardBarChart :labels="currentData.chart.labels" :data="currentData.chart.values" />
        </ClientOnly>
      </div>
    </div>

  </div>
</template>
