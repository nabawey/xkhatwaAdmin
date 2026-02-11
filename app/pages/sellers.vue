<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import { ref, computed } from 'vue';
import type { TableColumn } from '#ui/types';

interface Seller {
  name: string;
  title: string;
  email: string;
  role: string;
}

const sellers: Seller[] = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
  { name: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member' }
];

const columns: TableColumn<Seller>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
];

// search
const search = ref('');
const filtered = computed(() =>
  sellers.filter(s =>
    Object.values(s).some(val =>
      val.toLowerCase().includes(search.value.toLowerCase())
    )
  )
);

// pagination
const page = ref(1);
const pageSize = 5;
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);
</script>

<template>
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
    <AppPageHeader title="Users"
      description="A list of all the users in your account including their name, title, email and role." />
    <UModal>
      <UButton label="Add New Seller"
        class="flex items-center justify-center rounded-md bg-green-800 hover:bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm w-full sm:w-auto" />
      <template #content>
        <AppAddSeller />
      </template>
    </UModal>
  </div>

  <!-- Table -->
  <AppDataTable :data="paginated" :columns="columns" :page-size="5" searchable />

</template>
