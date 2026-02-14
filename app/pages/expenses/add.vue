<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });
useHead({
  title: 'Add Expense'
})

import { ref, reactive, onMounted } from 'vue';

interface Expense {
  SellerID: number | null;
  Details: string;
  ExpenseDate: string;
  Amount: number | null;
}

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Form State
const form = reactive<Expense>({
  SellerID: null,
  Details: '',
  ExpenseDate: new Date().toISOString().split('T')[0]?? '',
  Amount: null
});

// Keyboard Navigation Logic
const inputs = ref<HTMLElement[]>([]);
const setInputRef = (el: any) => {
  if (el) inputs.value.push(el);
};

// Clear refs on update to prevent duplicates
onBeforeUpdate(() => {
  inputs.value = [];
});

const moveFocus = (index: number, direction: 'up' | 'down') => {
  const nextIndex = direction === 'down' ? index + 1 : index - 1;
  if (nextIndex >= 0 && nextIndex < inputs.value.length) {
    inputs.value[nextIndex]?.focus();
  }
};

const resetForm = () => {
  form.SellerID = null;
  form.Details = '';
  form.ExpenseDate = new Date().toISOString().split('T')[0] ?? '';
  form.Amount = null;
  inputs.value[0]?.focus(); // Return focus to first field
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  
  try {
    // Simulated API Call
    await new Promise((resolve) => setTimeout(resolve, 800));
    showSuccess.value = true;
    resetForm();
    setTimeout(() => (showSuccess.value = false), 3000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-black p-4 sm:p-8">
    <div class="max-w-3xl mx-auto">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 class="text-2xl font-bold text-white">Add Expense</h1>
        <NuxtLink to="/expenses" class="text-sm text-gray-400 hover:text-green-400 flex items-center">
          <Icon name="heroicons-outline:arrow-left" class="mr-2" /> Back to List
        </NuxtLink>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-10 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400">Seller ID</label>
              <input 
                :ref="setInputRef"
                v-model.number="form.SellerID"
                type="number"
                required
                placeholder="101"
                @keydown.down.prevent="moveFocus(0, 'down')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400">Amount</label>
              <input 
                :ref="setInputRef"
                v-model.number="form.Amount"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                @keydown.down.prevent="moveFocus(1, 'down')"
                @keydown.up.prevent="moveFocus(1, 'up')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
              />
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label class="text-sm font-medium text-gray-400">Date</label>
              <input 
                :ref="setInputRef"
                v-model="form.ExpenseDate"
                type="date"
                required
                @keydown.down.prevent="moveFocus(2, 'down')"
                @keydown.up.prevent="moveFocus(2, 'up')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none [color-scheme:dark]"
              />
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label class="text-sm font-medium text-gray-400">Details</label>
              <textarea 
                :ref="setInputRef"
                v-model="form.Details"
                rows="3"
                required
                placeholder="Enter description..."
                @keydown.up.prevent="moveFocus(3, 'up')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-800">
            <p class="hidden sm:block text-xs text-gray-500">Press <span class="text-gray-300">Enter</span> to save</p>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full sm:w-auto bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Expense' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
