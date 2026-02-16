<script setup lang="ts">
definePageMeta({
  layout: false, 
  supabase: {
    redirectOptions: {
      exclude: true
    }
  }
});

useHead({
  title: 'Login'
})

// 2. Composables
const supabase = useSupabaseClient();
const toast = useToast();

// 3. Form State
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

// 4. Login Logic
const handleLogin = async () => {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Success Feedback
    toast.add({
      title: 'Success',
      description: 'Redirecting to dashboard...',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    });

    // Move to dashboard
    await navigateTo('/invoices/add'); 
    
  } catch (err: any) {
    // Error Feedback
    toast.add({
      title: 'Login Failed',
      description: err.message || 'Check your email and password.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="@container flex h-screen bg-black overflow-hidden">
    <div class="flex min-h-full min-w-full md:min-w-[50%] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-40 w-auto" src="/xkhatwaLogo.png" alt="X Khatwa" />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
            <div class="mt-2">
              <input 
                v-model="email"
                type="email" 
                id="email" 
                required
                autocomplete="email"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white border border-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm/6 outline-none transition-all" 
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
            </div>
            <div class="mt-2">
              <input 
                v-model="password"
                type="password" 
                id="password" 
                required
                autocomplete="current-password"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white border border-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm/6 outline-none transition-all" 
              />
            </div>
          </div>

          <div>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <template v-if="isSubmitting">
                <Icon name="heroicons:arrow-path" class="animate-spin w-5 h-5 mr-2" />
                Signing in...
              </template>
              <template v-else>
                Sign in
              </template>
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?
          <span class="font-semibold text-indigo-400 hover:text-indigo-300 block">
            Call Mr. Mohamed Nabawey for an account.
          </span>
        </p>
      </div>
    </div>

    <div class="flex-1">
      <img class="hidden md:block w-full h-full object-cover" src="/xkhatwaCover.jpg" alt="Cover" />
    </div>
  </div>
</template>
