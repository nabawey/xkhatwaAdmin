<script setup>
// No script logic needed for static layout
</script>

<template>
    <aside class="w-64 flex flex-col justify-between border-r border-gray-800">
        <!-- User Profile -->
        <div class="px-6 py-4 flex items-center border-b border-gray-800">
            <img src="/mn.png" alt="User Avatar" class="h-10 w-10 rounded-full" />
            <span class="ml-3 font-medium">Mohamed Nabwey</span>
        </div>


        <!-- Navigation -->
        <nav class="flex-1 px-4 mt-6 space-y-2">
            <NuxtLink to="/" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
                <div class="flex items-center cursor-pointer">
                    <Icon name="heroicons-outline:home" class="w-6 h-6 mr-3 group-hover:text-green-400" />
                    <span class="group-hover:text-green-400">Dashboard</span>
                </div>

            </NuxtLink>
            <NuxtLink to="/sellers" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
                <Icon name="heroicons-outline:user-group" class="w-6 h-6 mr-3 group-hover:text-green-400" />
                <span class="group-hover:text-green-400">Sellers</span>
            </NuxtLink>
            <NuxtLink to="/invoices" class="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 group">
                <Icon name="heroicons-outline:document-text" class="w-6 h-6 mr-3 group-hover:text-green-400" />
                <span class="group-hover:text-green-400">Invoices</span>
            </NuxtLink>
        </nav>

        <!-- Logo -->
        <div class="px-6 py-4 border-t border-gray-800">
            <img src="/xkhatwaLogo.png" alt="Company Logo" class="h-50 w-auto mx-auto rounded-full" />
        </div>



    </aside>
</template>
