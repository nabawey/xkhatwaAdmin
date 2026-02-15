<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const expenseId = route.params.id;

useHead({
  title: t('expenses.edit_title')
})

interface ExpenseForm {
  SellerID: number | null;
  Details: string;
  ExpenseDate: string;
  Amount: number | null;
}

const form = reactive<ExpenseForm>({
  SellerID: null,
  Details: '',
  ExpenseDate: '',
  Amount: null
});

const errors = reactive({
  Details: '',
  Amount: '',
  ExpenseDate: ''
});

const isSubmitting = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    const mockExpense = {
      SellerID: 101,
      Details: 'Office Supplies - Paper and Ink',
      ExpenseDate: '2026-02-01',
      Amount: 150.75
    };
    Object.assign(form, mockExpense);
  } finally {
    isLoading.value = false;
  }
});

const validate = () => {
  errors.Details = !form.Details ? t('expenses.validation.details_required') : '';
  errors.Amount = (form.Amount === null || form.Amount <= 0) ? t('expenses.validation.amount_required') : '';
  errors.ExpenseDate = !form.ExpenseDate ? t('expenses.validation.date_required') : '';
  return !errors.Details && !errors.Amount && !errors.ExpenseDate;
};

const handleSubmit = async () => {
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/expenses');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-black p-4 sm:p-8">
    <div class="max-w-3xl mx-auto">
      
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ t('expenses.edit_title') }}</h1>
          <p class="text-gray-400 text-sm">{{ t('expenses.edit_subtitle') }} #{{ expenseId }}</p>
        </div>
        <NuxtLink to="/expenses" class="text-sm text-gray-400 hover:text-orange-400 flex items-center">
          <Icon name="heroicons-outline:arrow-left" class="me-2" /> {{ t('common.back') }}
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="p-10 bg-gray-900 rounded-2xl animate-pulse space-y-4">
        <div class="h-8 bg-gray-800 rounded w-1/2"></div>
        <div class="h-12 bg-gray-800 rounded"></div>
      </div>

      <div v-else class="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 inset-inline-start-0 w-1 h-full bg-orange-500"></div>
        
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-10 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('expenses.seller_id') }}</label>
              <input v-model.number="form.SellerID" type="number" 
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('expenses.date') }}</label>
              <input v-model="form.ExpenseDate" type="date" 
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                :class="{'border-red-500': errors.ExpenseDate}" />
              <span v-if="errors.ExpenseDate" class="text-xs text-red-500 ms-1">{{ errors.ExpenseDate }}</span>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('expenses.amount') }}</label>
              <div class="relative">
                <span class="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input v-model.number="form.Amount" type="number" step="0.01"
                  class="w-full bg-black border border-gray-700 rounded-xl ps-8 pe-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 outline-none" />
              </div>
              <span v-if="errors.Amount" class="text-xs text-red-500 ms-1">{{ errors.Amount }}</span>
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label class="text-sm font-medium text-gray-400 ms-1">{{ t('expenses.details') }}</label>
              <textarea v-model="form.Details" rows="3" 
                class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 outline-none resize-none"></textarea>
              <span v-if="errors.Details" class="text-xs text-red-500 ms-1">{{ errors.Details }}</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-800">
            <button type="button" @click="router.push('/expenses')" class="text-gray-400 hover:text-white transition-colors">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="bg-orange-600 hover:bg-orange-500 text-white px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
              <AppLoadingSpinner v-if="isSubmitting" />
              {{ t('expenses.update_btn') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
