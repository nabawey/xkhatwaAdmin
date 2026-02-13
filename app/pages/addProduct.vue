<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, reactive, onBeforeUpdate } from 'vue';

interface Product {
  CategoryID: number | null;
  CategoryName: string;
  Description: string;
  Price: number | null;
  StockQuantity: number | null;
}

// Form State
const form = reactive<Product>({
  CategoryID: null,
  CategoryName: '',
  Description: '',
  Price: null,
  StockQuantity: null
});

const errors = reactive({
  CategoryName: '',
  Price: '',
  StockQuantity: ''
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

// Keyboard Navigation Logic
const inputs = ref<HTMLElement[]>([]);
const setInputRef = (el: any) => {
  if (el) inputs.value.push(el);
};

onBeforeUpdate(() => {
  inputs.value = [];
});

const moveFocus = (index: number, direction: 'up' | 'down') => {
  const nextIndex = direction === 'down' ? index + 1 : index - 1;
  if (nextIndex >= 0 && nextIndex < inputs.value.length) {
    inputs.value[nextIndex]?.focus();
  }
};

// Simple Validation
const validate = () => {
  let isValid = true;
  errors.CategoryName = !form.CategoryName ? 'Category name is required' : '';
  errors.Price = (form.Price === null || form.Price <= 0) ? 'Price must be greater than 0' : '';
  errors.StockQuantity = (form.StockQuantity === null || form.StockQuantity < 0) ? 'Stock cannot be negative' : '';
  
  if (errors.CategoryName || errors.Price || errors.StockQuantity) isValid = false;
  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;
  
  isSubmitting.value = true;
  try {
    // API Call simulation
    await new Promise(resolve => setTimeout(resolve, 800));
    showSuccess.value = true;
    
    // Reset Form
    Object.assign(form, { CategoryID: null, CategoryName: '', Description: '', Price: null, StockQuantity: null });
    inputs.value[0]?.focus();
    
    setTimeout(() => (showSuccess.value = false), 3000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-black p-4 sm:p-8">
    <div class="max-w-3xl mx-auto">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">Add New Product</h1>
          <p class="text-gray-400 text-sm">Create a new item in your inventory</p>
        </div>
        <NuxtLink to="/products" class="text-sm text-gray-400 hover:text-green-400 flex items-center transition-colors">
          <Icon name="heroicons-outline:arrow-left" class="mr-2" /> Back to Products
        </NuxtLink>
      </div>

      <Transition name="fade">
        <div v-if="showSuccess" class="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-xl flex items-center text-green-400">
          <Icon name="heroicons-outline:check-circle" class="w-6 h-6 mr-3 shrink-0" />
          Product successfully added to catalog!
        </div>
      </Transition>

      <div class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-10 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1">Category Name</label>
              <input 
                :ref="setInputRef"
                v-model="form.CategoryName"
                type="text"
                placeholder="e.g. Electronics"
                @keydown.down.prevent="moveFocus(0, 'down')"
                class="w-full bg-black border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                :class="errors.CategoryName ? 'border-red-500' : 'border-gray-700'"
              />
              <span v-if="errors.CategoryName" class="text-xs text-red-500 ml-1">{{ errors.CategoryName }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1">Category ID (Optional)</label>
              <input 
                :ref="setInputRef"
                v-model.number="form.CategoryID"
                type="number"
                placeholder="1"
                @keydown.down.prevent="moveFocus(1, 'down')"
                @keydown.up.prevent="moveFocus(1, 'up')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1">Price</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input 
                  :ref="setInputRef"
                  v-model.number="form.Price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  @keydown.down.prevent="moveFocus(2, 'down')"
                  @keydown.up.prevent="moveFocus(2, 'up')"
                  class="w-full bg-black border rounded-xl pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                  :class="errors.Price ? 'border-red-500' : 'border-gray-700'"
                />
              </div>
              <span v-if="errors.Price" class="text-xs text-red-500 ml-1">{{ errors.Price }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1">Stock Quantity</label>
              <input 
                :ref="setInputRef"
                v-model.number="form.StockQuantity"
                type="number"
                placeholder="0"
                @keydown.down.prevent="moveFocus(3, 'down')"
                @keydown.up.prevent="moveFocus(3, 'up')"
                class="w-full bg-black border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                :class="errors.StockQuantity ? 'border-red-500' : 'border-gray-700'"
              />
              <span v-if="errors.StockQuantity" class="text-xs text-red-500 ml-1">{{ errors.StockQuantity }}</span>
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label class="text-sm font-medium text-gray-400 ml-1">Description</label>
              <textarea 
                :ref="setInputRef"
                v-model="form.Description"
                rows="3"
                placeholder="Detailed product information..."
                @keydown.up.prevent="moveFocus(4, 'up')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-800">
            <button 
              type="button" 
              @click="Object.assign(form, { CategoryName: '', CategoryID: null, Description: '', Price: null, StockQuantity: null })"
              class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full sm:w-auto bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20"
            >
              <Icon v-if="isSubmitting" name="svg-spinners:180-ring" class="w-5 h-5 mr-2 inline" />
              {{ isSubmitting ? 'Adding...' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
