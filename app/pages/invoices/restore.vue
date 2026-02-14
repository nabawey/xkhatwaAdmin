<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });
useHead({
  title: 'Restore Invoice'
})
import { ref, reactive, computed, onBeforeUpdate, nextTick } from 'vue';

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

// --- Defaults for Resetting ---
const getInitialHeader = (): Invoice => ({
  CustomerName: '',
  InvoiceDate: new Date().toISOString().split('T')[0] ?? '',
  Discount: 0,
  Notes: ''
});

const getInitialDetails = (): InvoiceDetail[] => [
  { ProductID: null, Quantity: 1, UnitPrice: 0 }
];

// --- State ---
const header = reactive<Invoice>(getInitialHeader());
const details = ref<InvoiceDetail[]>(getInitialDetails());
const errors = ref<string[]>([]);
const isSubmitting = ref(false);

// --- Product Database Logic ---
const productDb: Record<number, number> = { 1: 50, 2: 100, 3: 150 };

const updatePrice = (index: number) => {
  const row = details.value[index];
  if (!row) return;

  // Enforce ProductID >= 1
  if (row.ProductID !== null && row.ProductID < 1) row.ProductID = 1;

  if (row.ProductID && productDb[row.ProductID]) {
    row.UnitPrice = productDb[row.ProductID] ?? 0;
  } else {
    row.UnitPrice = 0;
  }
};

// --- Input Sanitation ---
const enforceMinQuantity = (index: number) => {
  const row = details.value[index];
  if (!row) return;
  if (row.Quantity < 1) row.Quantity = 1;
};

const enforceMinDiscount = () => {
  if (header.Discount < 0) header.Discount = 0;
};

// --- Form Actions ---
const resetForm = () => {
  Object.assign(header, getInitialHeader());
  details.value = getInitialDetails();
  errors.value = [];
};

const handleClearForm = () => {
  if (confirm("Are you sure you want to clear the entire form?")) {
    resetForm();
  }
};

// --- Keyboard Navigation ---
const inputs = ref<HTMLElement[]>([]);
const setInputRef = (el: any) => { if (el) inputs.value.push(el); };
onBeforeUpdate(() => { inputs.value = []; });

const handleNav = (index: number, e: KeyboardEvent) => {
  if (e.key === '+') {
    e.preventDefault();
    addRow();
    nextTick(() => {
      const newRowInputIndex = inputs.value.length - 2; 
      inputs.value[newRowInputIndex]?.focus();
    });
    return;
  }

  if (e.key === 'ArrowRight' || (e.key === 'Enter' && e.target instanceof HTMLInputElement)) {
    if (index < inputs.value.length - 1) {
      e.preventDefault();
      inputs.value[index + 1]?.focus();
    }
  } else if (e.key === 'ArrowLeft') {
    if (index > 0) {
      e.preventDefault();
      inputs.value[index - 1]?.focus();
    }
  } else if ((e.key === 'Delete' || e.key === 'Backspace')) {
    const isDetailInput = index >= 2 && index < (inputs.value.length - 1);
    const isEmpty = (e.target as HTMLInputElement).value === '';

    if (isDetailInput && isEmpty) {
      e.preventDefault();
      const detailRowIdx = Math.floor((index - 2) / 2);
      if (details.value.length > 1) {
        const targetFocus = index > 2 ? index - 1 : 1;
        removeRow(detailRowIdx);
        nextTick(() => { inputs.value[targetFocus]?.focus(); });
      }
    }
  }
};

// --- Calculations ---
const subtotal = computed(() => details.value.reduce((acc, row) => acc + (row.Quantity * row.UnitPrice), 0));
const totalPrice = computed(() => Math.max(0, subtotal.value - header.Discount));

const addRow = () => {
  details.value.push({ ProductID: null, Quantity: 1, UnitPrice: 0 });
};

const removeRow = (index: number) => {
  if (details.value.length > 1) details.value.splice(index, 1);
};

// --- Submission ---
const validateForm = () => {
  errors.value = [];
  if (!header.CustomerName.trim()) errors.value.push("Customer Name is required.");
  details.value.forEach((item, idx) => {
    if (!item.ProductID) errors.value.push(`Row ${idx + 1}: Product ID is required.`);
  });
  return errors.value.length === 0;
};

const submitInvoice = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;
  try {
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    alert("Invoice Saved Successfully!");
    resetForm(); // Requirement #1: Clear after submit
  } catch (e) {
    errors.value.push("Failed to save invoice.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-black text-gray-200 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 flex justify-between items-end">
        <h1 class="text-3xl font-bold text-red-500 tracking-tight">Restore Invoice</h1>
        <div class="text-right">
          <p class="text-sm text-gray-500 uppercase font-semibold tracking-wider">Restore Total</p>
          <p class="text-4xl font-mono font-bold text-red-400">-${{ totalPrice.toFixed(2) }}</p>
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
            <label class="text-xs font-bold text-gray-500 tracking-wider">CUSTOMER NAME</label>
            <input :ref="setInputRef" v-model="header.CustomerName" type="text" @keydown="handleNav(0, $event)"
              class="bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500 tracking-wider">DATE</label>
            <input :ref="setInputRef" v-model="header.InvoiceDate" type="date" @keydown="handleNav(1, $event)"
              class="bg-black border border-gray-700 rounded-lg px-4 py-2.5 scheme-dark focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500 tracking-wider">SELLER</label>
            <input value="Mohamed Nabwey" disabled class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full min-w-150">
              <thead class="bg-black/40 text-left">
                <tr class="text-xs font-bold text-gray-500 border-b border-gray-800 uppercase tracking-widest">
                  <th class="px-6 py-4">Product ID</th>
                  <th class="px-6 py-4">Qty</th>
                  <th class="px-6 py-4">Unit Price</th>
                  <th class="px-6 py-4 text-right">Line Total</th>
                  <th class="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in details" :key="idx" class="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
                  <td class="px-4 py-3">
                    <input :ref="setInputRef" v-model.number="row.ProductID" type="number" min="1"
                      @input="updatePrice(idx)" @keydown="handleNav(2 + (idx * 2), $event)"
                      class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:border-green-500 outline-none" />
                  </td>
                  <td class="px-4 py-3">
                    <input :ref="setInputRef" v-model.number="row.Quantity" type="number" min="1"
                      @input="enforceMinQuantity(idx)" @keydown="handleNav(2 + (idx * 2) + 1, $event)"
                      class="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 focus:border-green-500 outline-none" />
                  </td>
                  <td class="px-6 py-3 text-gray-500 font-mono italic">${{ row.UnitPrice.toFixed(2) }}</td>
                  <td class="px-6 py-3 font-bold text-gray-300 font-mono text-right">${{ (row.Quantity * row.UnitPrice).toFixed(2) }}</td>
                  <td class="px-4 py-3">
                    <button type="button" @click="removeRow(idx)" class="p-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Icon name="heroicons-outline:trash" class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" @click="addRow" class="w-full py-4 bg-gray-800/30 hover:bg-gray-800 text-sm text-gray-400 border-t border-gray-800 transition-colors">
            + Add Line Item (or press + on keyboard)
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <textarea v-model="header.Notes" placeholder="Additional notes..." class="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500/50 h-86 resize-none transition-all"></textarea>
          
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-semibold uppercase tracking-wider">Subtotal</span>
              <span class="font-mono text-white tracking-tight text-lg">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center group">
              <span class="text-sm text-red-500 font-bold uppercase tracking-widest">Discount</span>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">$</span>
                <input :ref="setInputRef" v-model.number="header.Discount" type="number" min="0"
                  @input="enforceMinDiscount" @keydown="handleNav(inputs.length - 1, $event)"
                  class="w-32 bg-black border border-red-900/50 rounded-lg pl-6 pr-3 py-1.5 text-right text-red-500 font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              </div>
            </div>

            <div class="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span class="font-bold text-white text-lg uppercase tracking-wider">Total Payable</span>
              <span class="text-3xl font-bold text-green-400 font-mono">${{ totalPrice.toFixed(2) }}</span>
            </div>

            <div class="space-y-3 pt-2">
              <button type="submit" :disabled="isSubmitting"
                class="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest">
                <Icon v-if="isSubmitting" name="svg-spinners:180-ring" class="mr-2" />
                {{ isSubmitting ? 'Restoring...' : 'Restore Invoice' }}
              </button>
              
              <button type="button" @click="handleClearForm"
                class="w-full py-3 bg-transparent border border-gray-700 hover:border-red-500 hover:text-red-500 text-gray-500 font-semibold rounded-xl transition-all uppercase tracking-widest">
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Hide arrows for number inputs to keep the UI clean */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
