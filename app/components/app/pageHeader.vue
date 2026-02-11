<!-- components/PageHeader.vue -->
<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <!-- Title + Description -->
    <div>
      <h1 class="text-xl sm:text-2xl font-bold text-white">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-1 text-sm text-gray-400">
        {{ description }}
      </p>
    </div>

    <!-- Slot for custom actions -->
    <slot name="actions"></slot>
  </div>
</template>
