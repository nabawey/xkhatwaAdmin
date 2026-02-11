<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon: string
  title: string
  amount: string | number
  differencePercentage: number
  isPositive: boolean
}>()

// compute color class based on isPositive
const diffClass = computed(() =>
  props.isPositive ? 'text-green-500 bg-green-900/30' : 'text-red-500 bg-red-900/30'
)
</script>

<template>
  <div class="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow-md">
    <!-- Left side: icon + text -->
    <div class="flex items-center space-x-3">
      <UIcon :name="props.icon" class="w-8 h-8 text-green-500" />
      <div>
        <p class="text-sm font-medium text-gray-400">{{ props.title }}</p>
        <p class="text-xl font-bold text-white">{{ props.amount }}</p>
      </div>
    </div>

    <!-- Right side: percentage difference -->
    <div
      class="px-2 py-1 rounded-md text-sm font-semibold"
      :class="diffClass"
    >
      {{ props.isPositive ? '+' : '-' }}{{ props.differencePercentage }}%
    </div>
  </div>
</template>
