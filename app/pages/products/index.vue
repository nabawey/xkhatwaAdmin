<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });
useHead({
  title: 'Expenses'
})

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

interface Product {
  CategoryID: number
  CategoryName: string
  Description: string
  Price: number
  StockQuantity: number
}

const products: Product[] = [
  { CategoryID: 1, CategoryName: 'Electronics', Description: 'Smartphone with 128GB storage', Price: 699.99, StockQuantity: 50 },
  { CategoryID: 2, CategoryName: 'Books', Description: 'Hardcover novel', Price: 19.99, StockQuantity: 120 },
  { CategoryID: 3, CategoryName: 'Clothing', Description: 'Cotton T-shirt', Price: 9.99, StockQuantity: 200 }
]

/**
 * BEST PRACTICE: Define specific widths for columns that don't need much space.
 * 'class' property in Nuxt UI columns applies to <th> and <td>.
 */
const columns = [
  { accessorKey: 'CategoryID', header: 'ID', class: 'w-16' },
  { accessorKey: 'CategoryName', header: 'Category', class: 'w-32 md:w-44' },
  { accessorKey: 'Description', header: 'Description', class: 'min-w-[200px]' }, // Flexible column
  { accessorKey: 'Price', header: 'Price', class: 'w-24 text-right' },
  { accessorKey: 'StockQuantity', header: 'Stock', class: 'w-24 hidden lg:table-cell' }, // Hide on mobile/tablet
  { accessorKey: 'actions', header: 'Actions', class: 'w-24 text-right' }
]

const search = ref('')
const filtered = computed(() =>
  products.filter(p =>
    Object.values(p).some(val => String(val).toLowerCase().includes(search.value.toLowerCase()))
  )
)

const page = ref(1)
const pageSize = 5
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const handleUpdate = (id: number) => router.push(`/products/${id}`)

const handleDelete = (id: number) => {
  if (confirm('Delete product?')) console.log('Delete:', id)
}
</script>

<template>
  <div class="max-w-full space-y-6">
    <AppPageHeader 
      title="Products"
      description="Manage your catalog details, pricing, and inventory levels."
      buttonLabel="Add Product" 
      :onButtonClick="() => router.push('/products/add')" 
    />

    <div class="space-y-4">
      <div class="max-w-xs">
        <UInput v-model="search" placeholder="Search..." icon="heroicons-outline:search" />
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <UTable 
            :data="paginated" 
            :columns="columns" 
            class="min-w-full table-fixed md:table-auto"
          >
            <template #CategoryID-cell="{ row }">
              <span class="text-gray-500 font-mono text-xs">#{{ row.original.CategoryID }}</span>
            </template>

            <template #Description-cell="{ row }">
              <div class="truncate max-w-[150px] sm:max-w-[250px] md:max-w-xs text-gray-400" :title="row.original.Description">
                {{ row.original.Description }}
              </div>
            </template>

            <template #Price-cell="{ row }">
              <div>
                <span class="font-mono text-green-500 font-semibold">${{ row.original.Price.toFixed(2) }}</span>
              </div>
            </template>

            <template #actions-cell="{ row }">
              <div class="flex justify-start items-center gap-1 sm:gap-2">
                <button 
                  @click="handleUpdate(row.original.CategoryID)"
                  class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                >
                  <Icon name="heroicons:pencil-square" class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  @click="handleDelete(row.original.CategoryID)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </template>
          </UTable>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <p class="text-xs text-gray-500 order-2 sm:order-1">
          Showing {{ paginated.length }} of {{ filtered.length }} products
        </p>
        <UPagination v-model:page="page" :total="filtered.length" :items-per-page="pageSize" class="order-1 sm:order-2" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth horizontal scrolling on touch devices */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>