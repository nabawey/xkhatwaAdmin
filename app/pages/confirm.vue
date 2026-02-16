<script setup lang="ts">
const user = useSupabaseUser();

// Watch the user state; once it exists, redirect to home
watch(user, () => {
  if (user.value) {
    return navigateTo('/');
  }
}, { immediate: true });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="text-center space-y-4">
      <AppLoadingSpinner class="w-12 h-12 mx-auto text-green-500" />
      <p class="text-gray-400 animate-pulse">Establishing secure session...</p>
    </div>
  </div>
</template>