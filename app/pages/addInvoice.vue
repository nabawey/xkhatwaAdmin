<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });
import { ref, reactive, computed, onBeforeUpdate } from 'vue';

interface Invoice {
  CustomerName: string;
  InvoiceDate: string;
  Discount: number;
  Notes: string;
}

interface InvoiceDetail {
  ProductID: number | null;
  Quantity: number;
  UnitPrice: number;
}

// --- State ---
const header = reactive<Invoice>({
  CustomerName: '',
  InvoiceDate: new Date().toISOString().split('T')[0] ?? '',
  Discount: 0,
  Notes: ''
});

const details = ref<InvoiceDetail[]>([
  { ProductID: null, Quantity: 1, UnitPrice: 0 }
]);

const errors = ref<string[]>([]);
const isSubmitting = ref(false);

// --- Product Database Logic ---
const productDb: Record<number, number> = { 1: 50, 2: 100, 3: 150 };

/**
 * Direct update handler for Unit Price based on ProductID
 */
const updatePrice = (index: number) => {
  const row = details.value[index] ?? { ProductID: null, UnitPrice: 0 };
  if (row.ProductID && productDb[row.ProductID]) {
    row.UnitPrice = productDb[row.ProductID] ?? 0;
  } else {
    row.UnitPrice = 0;
  }
};

// --- Keyboard Navigation Logic ---
const inputs = ref<HTMLElement[]>([]);
const setInputRef = (el: any) => { if (el) inputs.value.push(el); };
onBeforeUpdate(() => { inputs.value = []; });

const handleNav = (index: number, e: KeyboardEvent) => {
  // ArrowRight or Enter moves forward
  if (e.key === 'ArrowRight' || (e.key === 'Enter' && e.target instanceof HTMLInputElement)) {
    if (index < inputs.value.length - 1) {
      e.preventDefault();
      inputs.value[index + 1]?.focus();
    }
  }
  // ArrowLeft moves backward
  else if (e.key === 'ArrowLeft') {
    if (index > 0) {
      e.preventDefault();
      inputs.value[index - 1]?.focus();
    }
  }
};

// --- Calculations ---
const subtotal = computed(() => details.value.reduce((acc, row) => acc + (row.Quantity * row.UnitPrice), 0));
const totalPrice = computed(() => Math.max(0, subtotal.value - header.Discount));

// --- Row Management ---
const addRow = () => {
  details.value.push({ ProductID: null, Quantity: 1, UnitPrice: 0 });
};

const removeRow = (index: number) => {
  if (details.value.length > 1) details.value.splice(index, 1);
};

// --- Validation ---
const validateForm = () => {
  errors.value = [];
  if (!header.CustomerName.trim()) errors.value.push("Customer Name is required.");

  details.value.forEach((item, idx) => {
    if (!item.ProductID) errors.value.push(`Row ${idx + 1}: Product ID is required.`);
    if (item.Quantity <= 0) errors.value.push(`Row ${idx + 1}: Quantity must be greater than 0.`);
  });

  return errors.value.length === 0;
};

const submitInvoice = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    console.log("Submitting Invoice Payload:", { header, details: details.value, total: totalPrice.value });
    await new Promise(r => setTimeout(r, 1000));
    alert("Invoice Saved Successfully!");
  } catch (e) {
    errors.value.push("Failed to save invoice. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-black text-gray-200 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">

      <div class="mb-8 flex justify-between items-end">
        <h1 class="text-3xl font-bold text-white tracking-tight">New Invoice</h1>
        <div class="text-right">
          <p class="text-sm text-gray-500 uppercase font-semibold">Grand Total</p>
          <p class="text-4xl font-mono font-bold text-green-400">${{ totalPrice.toFixed(2) }}</p>
        </div>
      </div>

      <div v-if="errors.length" class="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
        <ul class="list-disc list-inside text-red-400 text-sm space-y-1">
          <li v-for="err in errors" :key="err">{{ err }}</li>
        </ul>
      </div>

      <form @submit.prevent="submitInvoice" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500">CUSTOMER NAME</label>
            <input :ref="setInputRef" v-model="header.CustomerName" type="text" @keydown="handleNav(0, $event)"
              class="bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500">DATE</label>
            <input :ref="setInputRef" v-model="header.InvoiceDate" type="date" @keydown="handleNav(1, $event)"
              class="bg-black border border-gray-700 rounded-lg px-4 py-2.5 [color-scheme:dark] focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500">SELLER</label>
            <input value="Mohamed Nabwey" disabled
              class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead class="bg-black/40 text-left">
                <tr class="text-xs font-bold text-gray-500 border-b border-gray-800">
                  <th class="px-6 py-4">PRODUCT ID</th>
                  <th class="px-6 py-4">QTY</th>
                  <th class="px-6 py-4">UNIT PRICE (AUTO)</th>
                  <th class="px-6 py-4">LINE TOTAL</th>
                  <th class="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in details" :key="idx"
                  class="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
                  <td class="px-4 py-3">
                    <input :ref="setInputRef" v-model.number="row.ProductID" type="number" placeholder="1, 2 or 3"
                      @input="updatePrice(idx)" @keydown="handleNav(2 + (idx * 2), $event)"
                      class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:border-green-500 outline-none transition-colors" />
                  </td>
                  <td class="px-4 py-3">
                    <input :ref="setInputRef" v-model.number="row.Quantity" type="number"
                      @keydown="handleNav(2 + (idx * 2) + 1, $event)"
                      class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:border-green-500 outline-none transition-colors" />
                  </td>
                  <td class="px-6 py-3 text-gray-400 font-mono italic">
                    ${{ row.UnitPrice.toFixed(2) }}
                  </td>
                  <td class="px-6 py-3 font-bold text-gray-300">
                    ${{ (row.Quantity * row.UnitPrice).toFixed(2) }}
                  </td>
                  <td class="px-4 py-3">
                    <button type="button" @click="removeRow(idx)"
                      class="p-2 text-gray-600 hover:text-red-500 transition-colors" aria-label="Delete row">
                      <Icon name="heroicons-outline:trash" class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" @click="addRow"
            class="w-full py-4 bg-gray-800/30 hover:bg-gray-800 text-sm text-gray-400 border-t border-gray-800 transition-colors font-medium">
            + Add Line Item
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <textarea v-model="header.Notes" placeholder="Additional notes or terms..."
            class="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500/50 h-64 transition-all"></textarea>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-400">Subtotal</span>
              <span class="font-mono text-white">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center group">
              <span class="text-sm text-red-500 font-bold uppercase tracking-tighter">Discount</span>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">$</span>
                <input :ref="setInputRef" v-model.number="header.Discount" type="number"
                  @keydown="handleNav(inputs.length - 1, $event)"
                  class="w-32 bg-black border border-red-900/50 rounded-lg pl-6 pr-3 py-1.5 text-right text-red-500 font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              </div>
            </div>

            <div class="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span class="font-bold text-white">Payable</span>
              <span class="text-2xl font-bold text-green-400 font-mono">${{ totalPrice.toFixed(2) }}</span>
            </div>

            <button type="submit" :disabled="isSubmitting"
              class="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon v-if="isSubmitting" name="svg-spinners:180-ring" class="mr-2" />
              {{ isSubmitting ? 'PROCESSING...' : 'SAVE INVOICE' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Remove standard number input arrows */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* Custom Scrollbar for the table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #000;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
</style>
