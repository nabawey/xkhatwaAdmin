<script setup lang="ts">
import { ref } from 'vue';

const isCollapsed = ref(false);
const isMobileOpen = ref(false);

// Submenu States
const isInvoicesOpen = ref(false);
const isProductsOpen = ref(false);
const isExpensesOpen = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  // Close submenus when collapsing for a cleaner UI
  if (isCollapsed.value) {
    isInvoicesOpen.value = false;
    isProductsOpen.value = false;
    isExpensesOpen.value = false;
  }
};

const toggleMobileSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value;
};

// Toggle functions for submenus
const toggleInvoices = () => (isInvoicesOpen.value = !isInvoicesOpen.value);
const toggleProducts = () => (isProductsOpen.value = !isProductsOpen.value);
const toggleExpenses = () => (isExpensesOpen.value = !isExpensesOpen.value);
</script>

<template>
  <div class="flex">
    <button 
      @click="toggleMobileSidebar"
      class="fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-900 hover:bg-gray-800 md:hidden transition-colors"
      aria-label="Toggle Menu"
    >
      <Icon :name="isMobileOpen ? 'heroicons-outline:x' : 'heroicons-outline:menu'" class="w-6 h-6 text-gray-300" />
    </button>

    <aside
      class="fixed inset-y-0 left-0 flex flex-col justify-between border-r border-gray-800 bg-black transition-all duration-300 ease-in-out z-40 md:static md:translate-x-0"
      :class="[
        isCollapsed ? 'w-20' : 'w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="hidden md:flex justify-end p-2 border-b border-gray-800">
        <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-800 transition-colors">
          <Icon 
            :name="isCollapsed ? 'heroicons-outline:chevron-right' : 'heroicons-outline:chevron-left'"
            class="w-6 h-6 text-gray-300" 
          />
        </button>
      </div>

      <div 
        class="px-6 py-4 flex items-center border-b border-gray-800 transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <img src="/mn.png" alt="User Avatar" class="h-10 w-10 rounded-full flex-shrink-0" />
        <span v-if="!isCollapsed" class="ml-3 font-medium whitespace-nowrap text-gray-200 hover:text-green-400 truncate">
          Mohamed Nabwey
        </span>
      </div>

      <nav class="flex-1 px-4 mt-6 space-y-2 overflow-y-auto custom-scrollbar">
        <NuxtLink to="/" class="flex items-center px-3 py-2 rounded-md group transition-colors" active-class="bg-gray-800 text-green-400">
          <Icon name="heroicons-outline:home" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Dashboard</span>
        </NuxtLink>

        <NuxtLink to="/sellers" class="flex items-center px-3 py-2 rounded-md group transition-colors" active-class="bg-gray-800 text-green-400">
          <Icon name="heroicons-outline:user-group" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Sellers</span>
        </NuxtLink>

        <div class="space-y-1">
          <button @click="toggleInvoices" 
            class="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-800 group transition-colors focus:outline-none">
            <Icon name="heroicons-outline:document-text" class="w-6 h-6 mr-3 group-hover:text-green-400" />
            <span v-if="!isCollapsed" class="flex-1 text-left group-hover:text-green-400">Invoices</span>
            <Icon v-if="!isCollapsed" :name="isInvoicesOpen ? 'heroicons-outline:chevron-up' : 'heroicons-outline:chevron-down'" 
              class="w-4 h-4 text-gray-400 ml-auto transition-transform" />
          </button>
          <div v-show="isInvoicesOpen && !isCollapsed" class="ml-8 space-y-1">
            <NuxtLink to="/invoices" class="flex items-center px-3 py-2 rounded-md group text-sm" active-class="bg-gray-800 text-green-400">
              <Icon name="heroicons-outline:list-bullet" class="w-5 h-5 mr-3 group-hover:text-green-400" />
              <span class="group-hover:text-green-400">Invoices List</span>
            </NuxtLink>
            <NuxtLink to="/addInvoice" class="flex items-center px-3 py-2 rounded-md group text-sm" active-class="bg-gray-800 text-green-400">
              <Icon name="heroicons-outline:plus-circle" class="w-5 h-5 mr-3 group-hover:text-green-400" />
              <span class="group-hover:text-green-400">Add Invoice</span>
            </NuxtLink>
          </div>
        </div>

        <div class="space-y-1">
          <button @click="toggleProducts" 
            class="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-800 group transition-colors focus:outline-none">
            <Icon name="heroicons-outline:shopping-bag" class="w-6 h-6 mr-3 group-hover:text-green-400" />
            <span v-if="!isCollapsed" class="flex-1 text-left group-hover:text-green-400">Products</span>
            <Icon v-if="!isCollapsed" :name="isProductsOpen ? 'heroicons-outline:chevron-up' : 'heroicons-outline:chevron-down'" 
              class="w-4 h-4 text-gray-400 ml-auto transition-transform" />
          </button>
          <div v-show="isProductsOpen && !isCollapsed" class="ml-8 space-y-1">
            <NuxtLink to="/products" class="flex items-center px-3 py-2 rounded-md group text-sm" active-class="bg-gray-800 text-green-400">
              <Icon name="heroicons-outline:list-bullet" class="w-5 h-5 mr-3 group-hover:text-green-400" />
              <span class="group-hover:text-green-400">Product List</span>
            </NuxtLink>
            <NuxtLink to="/addProduct" class="flex items-center px-3 py-2 rounded-md group text-sm" active-class="bg-gray-800 text-green-400">
              <Icon name="heroicons-outline:plus-circle" class="w-5 h-5 mr-3 group-hover:text-green-400" />
              <span class="group-hover:text-green-400">Add Product</span>
            </NuxtLink>
          </div>
        </div>

        <div class="space-y-1">
          <button @click="toggleExpenses" 
            class="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-800 group transition-colors focus:outline-none">
            <Icon name="heroicons-outline:currency-dollar" class="w-6 h-6 mr-3 group-hover:text-green-400" />
            <span v-if="!isCollapsed" class="flex-1 text-left group-hover:text-green-400">Expenses</span>
            <Icon v-if="!isCollapsed" :name="isExpensesOpen ? 'heroicons-outline:chevron-up' : 'heroicons-outline:chevron-down'" 
              class="w-4 h-4 text-gray-400 ml-auto transition-transform" />
          </button>
          <div v-show="isExpensesOpen && !isCollapsed" class="ml-8 space-y-1">
            <NuxtLink to="/expenses" class="flex items-center px-3 py-2 rounded-md group text-sm" active-class="bg-gray-800 text-green-400">
              <Icon name="heroicons-outline:list-bullet" class="w-5 h-5 mr-3 group-hover:text-green-400" />
              <span class="group-hover:text-green-400">Expense List</span>
            </NuxtLink>
            <NuxtLink to="/addExpense" class="flex items-center px-3 py-2 rounded-md group text-sm" active-class="bg-gray-800 text-green-400">
              <Icon name="heroicons-outline:plus-circle" class="w-5 h-5 mr-3 group-hover:text-green-400" />
              <span class="group-hover:text-green-400">Add Expense</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="px-6 py-4 border-t border-gray-800 flex justify-center group shrink-0">
        <img src="/xkhatwaLogo.png" alt="Company Logo"
          class="transition-all duration-300 ease-in-out group-hover:content-[url('/green-black-logo.png')]"
          :class="isCollapsed ? 'h-10 w-10 rounded-full' : 'h-16 w-auto'" />
      </div>
    </aside>

    <div v-if="isMobileOpen" @click="toggleMobileSidebar" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"></div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
</style>