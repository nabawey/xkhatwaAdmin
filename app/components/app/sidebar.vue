<script setup>
import { ref } from 'vue';

const isCollapsed = ref(false);
const isMobileOpen = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const toggleMobileSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value;
};
</script>

<template>
  <div class="flex">
    <!-- Mobile Burger Button (always top-right on mobile) -->
    <button @click="toggleMobileSidebar"
      class="fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-900 hover:bg-gray-800 md:hidden transition-colors">
      <Icon :name="isMobileOpen ? 'heroicons-outline:x' : 'heroicons-outline:menu'" class="w-6 h-6 text-gray-300" />
    </button>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 flex flex-col justify-between border-r border-gray-800 bg-black transition-all duration-300 ease-in-out z-40 md:static md:translate-x-0"
      :class="[
        isCollapsed ? 'w-20' : 'w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">
      <!-- Collapse Button (desktop only) -->
      <div class="flex justify-end p-2 border-b border-gray-800 hidden md:flex">
        <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-gray-800 transition-colors">
          <Icon :name="isCollapsed ? 'heroicons-outline:chevron-right' : 'heroicons-outline:chevron-left'"
            class="w-6 h-6 text-gray-300" />
        </button>
      </div>

      <!-- User Profile -->
      <div class="px-6 py-4 flex items-center border-b border-gray-800 transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'justify-center' : ''">
        <img src="/mn.png" alt="User Avatar" class="h-10 w-10 rounded-full" />
        <span v-if="!isCollapsed" class="ml-3 font-medium whitespace-nowrap">
          Mohamed Nabwey
        </span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 mt-6 space-y-2">
        <NuxtLink to="/" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
          <Icon name="heroicons-outline:home" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Dashboard</span>
        </NuxtLink>

        <NuxtLink to="/sellers" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
          <Icon name="heroicons-outline:user-group" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Sellers</span>
        </NuxtLink>

        <NuxtLink to="/invoices" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
          <Icon name="heroicons-outline:document-text" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Invoices</span>
        </NuxtLink>

        <NuxtLink to="/products" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
          <Icon name="heroicons-outline:shopping-bag" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Products</span>
        </NuxtLink>

        <NuxtLink to="/expenses" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
          <Icon name="heroicons-outline:currency-dollar" class="w-6 h-6 mr-3 group-hover:text-green-400" />
          <span v-if="!isCollapsed" class="group-hover:text-green-400">Expenses</span>
        </NuxtLink>
      </nav>

      <!-- Logo -->
      <div class="px-6 py-4 border-t border-gray-800 flex justify-center">
        <img src="/xkhatwaLogo.png" alt="Company Logo"
          class="h-12 w-12 rounded-full transition-all duration-300 ease-in-out"
          :class="isCollapsed ? '' : 'h-20 w-auto'" />
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div v-if="isMobileOpen" @click="toggleMobileSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden">
    </div>
  </div>
</template>
