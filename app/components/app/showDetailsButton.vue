<script setup lang="ts">

const props = defineProps<{
  data: any;
  title: string;
}>();

</script>

<template>
  <UModal>
    <UButton label="Show Details" color="neutral" variant="subtle" />

    <template #content>
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">{{ props.title }}</h2>
        <pre>{{ props.data }}</pre>
      </div>
    </template>
</UModal>
</template>
