<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n()
const router = useRouter()

useHead({
  title: t('products.list_title')
})

interface Product {
  CategoryID: number
  CategoryName: string
  Description: string
  Price: number
  StockQuantity: number
}

// Mock Data
const products: Product[] = [
  { CategoryID: 1, CategoryName: 'Electronics', Description: 'Smartphone with 128GB storage', Price: 699.99, StockQuantity: 50 },
  { CategoryID: 2, CategoryName: 'Books', Description: 'Hardcover novel', Price: 19.99, StockQuantity: 120 },
  { CategoryID: 3, CategoryName: 'Clothing', Description: 'Cotton T-shirt', Price: 9.99, StockQuantity: 200 }
]

const columns = [
  { accessorKey: 'CategoryID', header: t('expenses.id'), class: 'w-16' },
  { accessorKey: 'CategoryName', header: t('products.category_name'), class: 'w-32 md:w-44' },
  { accessorKey: 'Description', header: t('products.description'), class: 'min-w-[200px]' },
  { accessorKey: 'Price', header: t('products.price'), class: 'w-24 text-right' },
  { accessorKey: 'StockQuantity', header: t('products.stock'), class: 'w-24 hidden lg:table-cell' },
  { accessorKey: 'actions', header: t('common.actions'), class: 'w-24 text-right' }
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
  if (confirm(t('products.confirm_delete'))) {
    console.log('Delete Product:', id)
    // Implement API delete call here
  }
}
</script>

<template>
  <div class="max-w-full space-y-6">
    <AppPageHeader 
      :title="t('products.list_title')"
      :description="t('products.list_description')"
      :buttonLabel="t('sidebar.add_product')" 
      :onButtonClick="() => router.push('/products/add')" 
    />

    <div class="space-y-4">
      <div class="max-w-xs">
        <UInput 
          v-model="search" 
          :placeholder="t('common.search_placeholder')" 
          icon="heroicons-outline:search" 
          variant="outline"
          class="rounded-xl"
        />
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden relative">
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
                  :title="t('common.update')"
                >
                  <Icon name="heroicons:pencil-square" class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  @click="handleDelete(row.original.CategoryID)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  :title="t('common.close')"
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
          {{ t('common.showing') }} {{ paginated.length }} {{ t('common.of') }} {{ filtered.length }} {{ t('common.results') }}
        </p>
        <UPagination 
          v-model:page="page" 
          :total="filtered.length" 
          :items-per-page="pageSize" 
          class="order-1 sm:order-2" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
/* Subtle blue tint for active table rows on hover if needed */
tr:hover td {
  background-color: rgba(59, 130, 246, 0.02);
}
</style>
