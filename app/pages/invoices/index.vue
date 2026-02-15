<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'dashboard' });

const router = useRouter();
const { t } = useI18n();

useHead({
  title: t('invoices.list_title')
})

// --- Types ---
interface Invoice {
  InvoiceID: number;
  InvoiceDate: string;
  CustomerName: string;
  SellerName: string;
  TotalAmount: number;
}

interface InvoiceDetail {
  InvoiceDetailID: number;
  InvoiceID: number;
  CategoryID: number;
  Quantity: number;
  UnitPrice: number;
  LineTotal: number;
}

// --- Data State ---
const invoices: Invoice[] = [
  { InvoiceID: 1001, InvoiceDate: '2026-02-01', CustomerName: 'Alice Johnson', SellerName: 'Mohamed Nabwey', TotalAmount: 250.75 },
  { InvoiceID: 1002, InvoiceDate: '2026-02-03', CustomerName: 'Bob Smith', SellerName: 'Courtney Henry', TotalAmount: 120.0 },
  { InvoiceID: 1003, InvoiceDate: '2026-02-05', CustomerName: 'Charlie Davis', SellerName: 'Tom Cook', TotalAmount: 560.4 },
];

const invoiceDetails: InvoiceDetail[] = [
  { InvoiceDetailID: 1, InvoiceID: 1001, CategoryID: 10, Quantity: 2, UnitPrice: 50, LineTotal: 100 },
  { InvoiceDetailID: 2, InvoiceID: 1001, CategoryID: 12, Quantity: 3, UnitPrice: 50.25, LineTotal: 150.75 },
  { InvoiceDetailID: 3, InvoiceID: 1002, CategoryID: 15, Quantity: 1, UnitPrice: 120, LineTotal: 120 },
];

// --- Modal Logic ---
const isModalOpen = ref(false);
const selectedInvoiceItems = ref<InvoiceDetail[]>([]);
const selectedInvoiceID = ref<number | null>(null);

const handleShowDetails = (invoice: Invoice) => {
  selectedInvoiceID.value = invoice.InvoiceID;
  selectedInvoiceItems.value = invoiceDetails.filter(d => d.InvoiceID === invoice.InvoiceID);
  isModalOpen.value = true;
};

// --- Table Configuration ---
const columns = [
  { accessorKey: 'InvoiceID', header: t('expenses.id'), class: 'w-20' },
  { accessorKey: 'CustomerName', header: t('invoices.customer'), class: 'min-w-[140px]' },
  { accessorKey: 'TotalAmount', header: t('invoices.total'), class: 'min-w-[140px] text-center' },
  { accessorKey: 'details', header: t('invoices.items'), class: 'min-w-[140px] text-center' },
];

const search = ref('');
const filtered = computed(() =>
  invoices.filter(inv =>
    [inv.CustomerName, inv.InvoiceID.toString()].some(val => val.toLowerCase().includes(search.value.toLowerCase()))
  )
);

const page = ref(1);
const pageSize = 5;
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize)
);
</script>

<template>
  <div class="max-w-full space-y-6">
    <AppPageHeader 
      :title="t('invoices.list_title')"
      :description="t('invoices.list_description')"
      :buttonLabel="t('invoices.add_title')" 
      :onButtonClick="() => router.push('/addInvoice')" 
    />

    <div class="space-y-4">
      <div class="max-w-xs">
        <UInput v-model="search" :placeholder="t('invoices.search_hint')" icon="heroicons-outline:search" />
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden mx-1">
        <div class="overflow-x-auto scrollbar-thin">
          <UTable :data="paginated" :columns="columns" class="min-w-full table-fixed md:table-auto">
            
            <template #InvoiceID-cell="{ row }">
              <span class="text-gray-500 font-mono text-xs">#{{ row.original.InvoiceID }}</span>
            </template>

            <template #TotalAmount-cell="{ row }">
              <div class="font-mono font-bold text-green-500">
                ${{ row.original.TotalAmount.toFixed(2) }}
              </div>
            </template>

            <template #details-cell="{ row }">
              <UButton 
                :label="t('common.details')" 
                size="xs" 
                variant="subtle" 
                color="neutral" 
                @click="handleShowDetails(row.original)" 
              />
            </template>
          
          </UTable>
        </div>
      </div>

      <div class="flex items-center justify-between px-2">
        <p class="text-xs text-gray-500">{{ t('common.showing') }} {{ paginated.length }} {{ t('common.results') }}</p>
        <UPagination v-model:page="page" :total="filtered.length" :items-per-page="pageSize" />
      </div>
    </div>

    <UModal v-model:open="isModalOpen">
      <template #content>
        <div class="p-6 bg-gray-900 border border-gray-800 rounded-xl min-w-[320px] sm:min-w-[450px]">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-white">{{ t('invoices.invoice_number') }}{{ selectedInvoiceID }}</h2>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isModalOpen = false" />
          </div>

          <div class="space-y-3">
            <div v-for="item in selectedInvoiceItems" :key="item.InvoiceDetailID" class="p-4 bg-black/40 border border-gray-800 rounded-xl flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold text-gray-200">{{ t('products.category_name') }} {{ item.CategoryID }}</p>
                <p class="text-xs text-gray-500">{{ t('billing.qty') }}: {{ item.Quantity }} × ${{ item.UnitPrice }}</p>
              </div>
              <p class="text-sm font-mono font-bold text-white">${{ item.LineTotal }}</p>
            </div>
          </div>

          <div v-if="selectedInvoiceItems.length === 0" class="py-10 text-center text-gray-500 italic">
            {{ t('invoices.no_items') }}
          </div>

          <div class="mt-6 pt-4 border-t border-gray-800 text-right">
            <UButton :label="t('common.close')" color="neutral" variant="outline" @click="isModalOpen = false" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>