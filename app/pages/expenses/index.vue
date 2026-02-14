<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });
useHead({
  title: 'Expenses'
})
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Expense {
  ExpenseID: number
  SellerID: number
  Details: string
  ExpenseDate: string
  Amount: number
}

const expenses: Expense[] = [
  { ExpenseID: 1, SellerID: 101, Details: 'Office Supplies', ExpenseDate: '2026-02-01', Amount: 150.75 },
  { ExpenseID: 2, SellerID: 102, Details: 'Travel Expenses', ExpenseDate: '2026-02-03', Amount: 320.00 },
  { ExpenseID: 3, SellerID: 103, Details: 'Software Subscription', ExpenseDate: '2026-02-05', Amount: 99.99 }
]

// Best Practice: Define column classes to handle width distribution
const columns = [
  { accessorKey: 'ExpenseID', header: 'ID', class: 'w-16' }, 
  { accessorKey: 'Details', header: 'Description', class: 'min-w-[200px] flex-1' },
  { accessorKey: 'ExpenseDate', header: 'Date', class: 'w-32 hidden sm:table-cell' }, // Hidden on tiny screens
  { accessorKey: 'Amount', header: 'Amount', class: 'w-24 text-right' },
  { accessorKey: 'actions', header: 'Actions', class: 'w-24 text-right' }
]

const search = ref('')
const filtered = computed(() =>
  expenses.filter(e =>
    Object.values(e).some(val => String(val).toLowerCase().includes(search.value.toLowerCase()))
  )
)

const page = ref(1)
const pageSize = 5
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const handleUpdate = (id: number) => {
  router.push(`/expenses/${id}`)
}
</script>

<template>
  <div class="max-w-full overflow-hidden px-1">
    <AppPageHeader 
      title="Expenses"
      description="Track your business spending and seller payments."
      buttonLabel="Add Expense" 
      :onButtonClick="() => router.push('/expenses/add')" 
    />

    <div class="mt-6 space-y-4">
      <div class="w-full md:max-w-sm">
        <UInput 
          v-model="search" 
          placeholder="Search expenses..." 
          icon="heroicons-outline:search" 
          size="md"
          class="w-full"
        />
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <UTable 
            :data="paginated" 
            :columns="columns" 
            class="min-w-full table-fixed md:table-auto"
          >
            <template #ExpenseID-cell="{ row }">
              <span class="text-gray-500 font-mono text-xs">#{{ row.original.ExpenseID }}</span>
            </template>

            <template #Details-cell="{ row }">
              <div class="font-medium text-gray-200 truncate max-w-45 sm:max-w-none">
                {{ row.original.Details }}
              </div>
            </template>

            <template #Amount-cell="{ row }">
              <div>
                <span class="font-mono font-bold text-orange-400">
                  -${{ row.original.Amount.toFixed(2) }}
                </span>
              </div>
            </template>

            <template #actions-cell="{ row }">
              <div class="flex justify-start gap-1 sm:gap-2">
                <button 
                  @click="handleUpdate(row.original.ExpenseID)" 
                  class="p-2 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-lg transition-all"
                >
                  <Icon name="heroicons:pencil-square" class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  class="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </template>
          </UTable>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <p class="text-xs text-gray-500 order-2 sm:order-1">
          Showing {{ paginated.length }} of {{ filtered.length }} results
        </p>
        <div class="order-1 sm:order-2">
          <UPagination v-model:page="page" :total="filtered.length" :items-per-page="pageSize" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Custom scrollbar styles for a more modern look on Windows/Linux */
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
</style>