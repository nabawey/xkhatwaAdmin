<script setup lang="ts">
import { ref, reactive, computed, onBeforeUpdate, nextTick } from 'vue';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();

useHead({
  title: t('sidebar.add_invoice')
});
const toast = useToast();


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

const getInitialHeader = (): Invoice => ({
  CustomerName: '',
  InvoiceDate: new Date().toISOString().split('T')[0] ?? '',
  Discount: 0,
  Notes: ''
});

const getInitialDetails = (): InvoiceDetail[] => [
  { ProductID: null, Quantity: 1, UnitPrice: 0 }
];

const header = reactive<Invoice>(getInitialHeader());
const details = ref<InvoiceDetail[]>(getInitialDetails());
const errors = ref<string[]>([]);
const isSubmitting = ref(false);

const productDb: Record<number, number> = { 1: 50, 2: 100, 3: 150 };

const updatePrice = (index: number) => {
  const row = details.value[index];
  if (!row) return;
  if (row.ProductID !== null && row.ProductID < 1) row.ProductID = 1;
  if (row.ProductID && productDb[row.ProductID]) {
    row.UnitPrice = productDb[row.ProductID] ?? 0;
  } else {
    row.UnitPrice = 0;
  }
};

const enforceMinQuantity = (index: number) => {
  const row = details.value[index];
  if (!row) return;
  if (row.Quantity < 1) row.Quantity = 1;
};

const enforceMinDiscount = () => {
  if (header.Discount < 0) header.Discount = 0;
};

const resetForm = () => {
  Object.assign(header, getInitialHeader());
  details.value = getInitialDetails();
  errors.value = [];
};

const handleClearForm = () => {
  resetForm();
  toast.add({ title: t('common.cleared_success'), color: 'success' });

};

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

const subtotal = computed(() => details.value.reduce((acc, row) => acc + (row.Quantity * row.UnitPrice), 0));
const totalPrice = computed(() => Math.max(0, subtotal.value - header.Discount));

const addRow = () => {
  details.value.push({ ProductID: null, Quantity: 1, UnitPrice: 0 });
};

const removeRow = (index: number) => {
  if (details.value.length > 1) details.value.splice(index, 1);
};

const validateForm = () => {
  errors.value = [];
  if (!header.CustomerName.trim()) errors.value.push(t('expenses.validation.customer_required'));
  details.value.forEach((item, idx) => {
    if (!item.ProductID) errors.value.push(`${t('expenses.validation.product_required')} ${idx + 1}`);
  });
  return errors.value.length === 0;
};

const submitInvoice = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));

    // Success Toast
    toast.add({
      title: t('common.success_save'),
      icon: 'i-heroicons-check-circle',
      color: 'success',
    });

    resetForm();
  } catch (e) {
    // Error Toast
    toast.add({
      title: t('common.error_occurred'), // Ensure this key exists in your JSON
      description: "Failed to save invoice. Please try again.",
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-black text-gray-200 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 flex justify-between items-end">
        <h1 class="text-3xl font-bold text-green-500 tracking-tight">{{ t('billing.new_invoice') }}</h1>
        <div class="text-right">
          <p class="text-sm text-gray-500 uppercase font-semibold tracking-wider">{{ t('billing.grand_total') }}</p>
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
            <label class="text-xs font-bold text-gray-500 tracking-wider uppercase">{{ t('billing.customer_name')
            }}</label>
            <input :ref="setInputRef" v-model="header.CustomerName" type="text" @keydown="handleNav(0, $event)"
              class="bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500 tracking-wider uppercase">{{ t('billing.date') }}</label>
            <input :ref="setInputRef" v-model="header.InvoiceDate" type="date" @keydown="handleNav(1, $event)"
              class="bg-black border border-gray-700 rounded-lg px-4 py-2.5 [color-scheme:dark] focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500 tracking-wider uppercase">{{ t('billing.seller') }}</label>
            <input value="Mohamed Nabwey" disabled
              class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <div class="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead class="bg-black/40">
                <tr
                  class="text-xs font-bold text-gray-500 border-b border-gray-800 uppercase tracking-widest text-start">
                  <th class="px-6 py-4 text-start">{{ t('billing.product_id') }}</th>
                  <th class="px-6 py-4 text-start">{{ t('billing.qty') }}</th>
                  <th class="px-6 py-4 text-start">{{ t('billing.unit_price') }}</th>
                  <th class="px-6 py-4 text-right">{{ t('billing.line_total') }}</th>
                  <th class="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in details" :key="idx"
                  class="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
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
                  <td class="px-6 py-3 text-gray-500 font-mono italic text-start">${{ row.UnitPrice.toFixed(2) }}</td>
                  <td class="px-6 py-3 font-bold text-gray-300 font-mono text-right">${{ (row.Quantity *
                    row.UnitPrice).toFixed(2) }}</td>
                  <td class="px-4 py-3">
                    <button type="button" @click="removeRow(idx)"
                      class="p-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Icon name="heroicons-outline:trash" class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" @click="addRow"
            class="w-full py-4 bg-gray-800/30 hover:bg-gray-800 text-sm text-gray-400 border-t border-gray-800 transition-colors">
            + {{ t('billing.add_line') }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <textarea v-model="header.Notes" :placeholder="t('billing.notes')"
            class="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500/50 h-[340px] resize-none transition-all"></textarea>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-semibold uppercase tracking-wider">{{ t('billing.subtotal') }}</span>
              <span class="font-mono text-white tracking-tight text-lg">${{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center group">
              <span class="text-sm text-red-500 font-bold uppercase tracking-widest">{{ t('billing.discount') }}</span>
              <div class="relative">
                <span class="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-red-500 font-bold">$</span>
                <input :ref="setInputRef" v-model.number="header.Discount" type="number" min="0"
                  @input="enforceMinDiscount" @keydown="handleNav(inputs.length - 1, $event)"
                  class="w-32 bg-black border border-red-900/50 rounded-lg ps-6 pe-3 py-1.5 text-right text-red-500 font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all" />
              </div>
            </div>

            <div class="pt-4 border-t border-gray-800 flex justify-between items-center">
              <span class="font-bold text-white text-lg uppercase tracking-wider">{{ t('billing.total_payable')
              }}</span>
              <span class="text-3xl font-bold text-green-400 font-mono">${{ totalPrice.toFixed(2) }}</span>
            </div>

            <div class="space-y-3 pt-2">
              <button type="submit" :disabled="isSubmitting"
                class="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest flex items-center justify-center">
                <Icon v-if="isSubmitting" name="svg-spinners:180-ring" class="me-2" />
                {{ isSubmitting ? t('common.saving') : t('billing.save_invoice') }}
              </button>

              <button type="button" @click="handleClearForm"
                class="w-full py-3 bg-transparent border border-gray-700 hover:border-red-500 hover:text-red-500 text-gray-500 font-semibold rounded-xl transition-all uppercase tracking-widest">
                {{ t('billing.clear_form') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
