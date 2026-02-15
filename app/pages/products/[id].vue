<script setup lang="ts">
import { ref, reactive, onBeforeUpdate, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const productId = route.params.id;

useHead({
  title: t('products.edit_title')
})

interface Product {
  CategoryID: number | null;
  CategoryName: string;
  Description: string;
  Price: number | null;
  StockQuantity: number | null;
}

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
const isLoading = ref(true);
const showSuccess = ref(false);

onMounted(async () => {
  try {
    // API Call simulation
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockData = {
      CategoryID: Number(productId),
      CategoryName: 'Existing Product Name',
      Description: 'This is the fetched description from the database.',
      Price: 299.99,
      StockQuantity: 15
    };

    Object.assign(form, mockData);
  } catch (err) {
    console.error("Failed to fetch product:", err);
  } finally {
    isLoading.value = false;
  }
});

const inputs = ref<HTMLElement[]>([]);
const setInputRef = (el: any) => { if (el) inputs.value.push(el); };
onBeforeUpdate(() => { inputs.value = []; });

const moveFocus = (index: number, direction: 'up' | 'down') => {
  const nextIndex = direction === 'down' ? index + 1 : index - 1;
  inputs.value[nextIndex]?.focus();
};

const validate = () => {
  let isValid = true;
  errors.CategoryName = !form.CategoryName ? t('products.validation.name_required') : '';
  errors.Price = (form.Price === null || form.Price <= 0) ? t('products.validation.price_min') : '';
  errors.StockQuantity = (form.StockQuantity === null || form.StockQuantity < 0) ? t('products.validation.stock_min') : '';
  if (errors.CategoryName || errors.Price || errors.StockQuantity) isValid = false;
  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;
  
  isSubmitting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
      router.push('/products');
    }, 2000);
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
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            {{ t('products.edit_title') }} 
            <span class="text-sm font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">#{{ productId }}</span>
          </h1>
          <p class="text-gray-400 text-sm">{{ t('products.edit_subtitle') }}</p>
        </div>
        <NuxtLink to="/products" class="text-sm text-gray-400 hover:text-blue-400 flex items-center transition-colors">
          <Icon name="heroicons-outline:arrow-left" class="me-2" /> {{ t('sidebar.product_list') }}
        </NuxtLink>
      </div>

      <Transition name="fade">
        <div v-if="showSuccess" class="mb-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl flex items-center text-blue-400">
          <Icon name="heroicons-outline:check-circle" class="w-6 h-6 me-3 shrink-0" />
          {{ t('products.success_update') }}
        </div>
      </Transition>

      <div v-if="isLoading" class="space-y-6 bg-gray-900/50 p-10 rounded-2xl animate-pulse border border-gray-800">
        <div class="h-10 bg-gray-800 rounded-xl w-3/4"></div>
        <div class="grid grid-cols-2 gap-6">
          <div class="h-12 bg-gray-800 rounded-xl"></div>
          <div class="h-12 bg-gray-800 rounded-xl"></div>
        </div>
        <div class="h-32 bg-gray-800 rounded-xl"></div>
      </div>

      <div v-else class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
        <div class="absolute inset-y-0 start-0 w-1 bg-blue-500"></div>
        
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-10 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('products.category_name') }}</label>
              <input 
                :ref="setInputRef"
                v-model="form.CategoryName"
                type="text"
                @keydown.down.prevent="moveFocus(0, 'down')"
                class="w-full bg-black border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                :class="errors.CategoryName ? 'border-red-500' : 'border-gray-700'"
              />
              <span v-if="errors.CategoryName" class="text-xs text-red-500 ms-1">{{ errors.CategoryName }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('products.category_id') }}</label>
              <input 
                :ref="setInputRef"
                v-model.number="form.CategoryID"
                type="number"
                disabled
                class="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('products.price') }}</label>
              <div class="relative">
                <span class="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input 
                  :ref="setInputRef"
                  v-model.number="form.Price"
                  type="number"
                  step="0.01"
                  @keydown.down.prevent="moveFocus(2, 'down')"
                  @keydown.up.prevent="moveFocus(2, 'up')"
                  class="w-full bg-black border rounded-xl ps-8 pe-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  :class="errors.Price ? 'border-red-500' : 'border-gray-700'"
                />
              </div>
              <span v-if="errors.Price" class="text-xs text-red-500 ms-1">{{ errors.Price }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('products.stock') }}</label>
              <input 
                :ref="setInputRef"
                v-model.number="form.StockQuantity"
                type="number"
                @keydown.down.prevent="moveFocus(3, 'down')"
                @keydown.up.prevent="moveFocus(3, 'up')"
                class="w-full bg-black border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                :class="errors.StockQuantity ? 'border-red-500' : 'border-gray-700'"
              />
              <span v-if="errors.StockQuantity" class="text-xs text-red-500 ms-1">{{ errors.StockQuantity }}</span>
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('products.description') }}</label>
              <textarea 
                :ref="setInputRef"
                v-model="form.Description"
                rows="3"
                @keydown.up.prevent="moveFocus(4, 'up')"
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-800">
            <button 
              type="button" 
              @click="router.push('/products')"
              class="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {{ t('common.discard') }}
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center"
            >
              <Icon v-if="isSubmitting" name="svg-spinners:180-ring" class="me-2" />
              {{ isSubmitting ? t('products.updating') : t('products.save_btn') }}
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
