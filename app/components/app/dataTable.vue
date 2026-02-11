<script setup lang="ts" generic="T">
import { ref, computed } from 'vue';
import type { TableColumn } from '#ui/types';


const props = defineProps<{
  data: T[];
  columns: TableColumn<T>[];
  pageSize?: number;
  searchable?: boolean;
}>();

const search = ref('');
const page = ref(1);
const pageSize = ref(props.pageSize ?? 5);

const filtered = computed(() => {
  if (!search.value) return props.data;
  return props.data.filter((row: T) =>
    Object.values(row as Record<string, any>).some((val) =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
);
</script>


<template>
  <div class="mt-4">
    <!-- Search -->
    <div v-if="props.searchable" class="mb-4">
      <UInput
        v-model="search"
        placeholder="Search..."
        icon="heroicons-outline:search"
        class="w-full"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <UTable :data="paginated" :columns="props.columns" striped class="min-w-full text-sm" />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center sm:justify-end mt-4">
      <UPagination
        v-model:page="page"
        :total="filtered.length"
        :items-per-page="pageSize"
      />
    </div>
  </div>
</template>
