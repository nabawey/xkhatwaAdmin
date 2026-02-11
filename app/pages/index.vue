<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Customers -->
    <AppSummaryCard icon="heroicons-outline:user-group" title="Customers" amount="984" :difference-percentage="14"
      :is-positive="false" />

    <!-- Conversions -->
    <AppSummaryCard icon="heroicons-outline:chart-bar" title="Conversions" amount="1939" :difference-percentage="5"
      :is-positive="false" />

    <!-- Revenue -->
    <AppSummaryCard icon="heroicons-outline:currency-dollar" title="Revenue" amount="$239,668"
      :difference-percentage="5" :is-positive="true" />

    <!-- Orders -->
    <AppSummaryCard icon="heroicons-outline:shopping-cart" title="Orders" amount="283" :difference-percentage="5"
      :is-positive="false" />
    </div>
</template>
