<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn } from '#ui/types'

interface Seller {
  name: string
  title: string
  email: string
  role: string
}

const sellers: Seller[] = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
  { name: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member' }
]

const columns: TableColumn<Seller>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' }
]

// search
const search = ref('')
const filtered = computed(() =>
  sellers.filter(s =>
    Object.values(s).some(val =>
      val.toLowerCase().includes(search.value.toLowerCase())
    )
  )
)


// pagination
const page = ref(1)
const pageSize = 5
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)
</script>

<template>
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Users</h1>
      <p class="mt-1 text-sm text-gray-400">
        A list of all the users in your account including their name, title, email and role.
      </p>
    </div>
    <button class="rounded-md bg-green-800 hover:bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ">
      Add user
    </button>
  </div>

  <!-- Search -->
  <div class="mt-4">
    <UInput v-model="search" placeholder="Search users..." />
  </div>

  <!-- Table -->
  <div class="mt-8 overflow-x-auto overflow-y-auto">
    <UTable :data="paginated" :columns="columns" striped class="w-full" />
    <UPagination v-model:page="page" :total="filtered.length" :items-per-page="pageSize" class="mt-4" />
  </div>
</template>
