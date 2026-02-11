<!-- components/SearchBar.vue -->
<script setup lang="ts">

defineProps<{
    modelValue: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
    <div class="w-full">
        <UInput :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
            :placeholder="placeholder || 'Search...'" icon="heroicons-outline:search" class="w-full" />
    </div>
</template>
