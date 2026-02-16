<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });

const { locale, setLocale, t } = useI18n();
const toast = useToast();

const language = ref(locale.value);
const theme = ref('dark');

const supabase = useSupabaseClient();

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    await navigateTo('/login');
  } else {
    toast.add({ title: 'Error signing out', color: 'error' });
  }
};

useHead({
  title: t('settings')
})


const { profile } = useProfile();
const defaultUser = reactive({
  name: 'John Doe',
  email: 'john.doe@example.com',
  image: '/avatar.svg',
});

const isSaving = ref(false);

const handleSave = async () => {
  isSaving.value = true;

  try {
    // Apply the language change
    await setLocale(language.value);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    toast.add({
      title: t('success_msg'),
      icon: 'i-heroicons-check-circle',
      color: 'success', // Nuxt UI default for success
    });

  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to update settings.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error', // Nuxt UI default for error
    });
  } finally {
    isSaving.value = false;
  }
};

</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-20 px-4 sm:px-6">
    <div class="pt-4">
      <h1 class="text-2xl font-bold text-white sm:text-3xl">{{ t('settings') }}</h1>
      <p class="text-gray-500 text-sm mt-1">{{ t('description') }}</p>
    </div>

    <section class="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
        <div class="relative group">
          <div
            class="w-28 h-28 rounded-3xl overflow-hidden border-4 border-gray-800 group-hover:border-green-500 transition-all duration-300">
            <img :src="profile?.imageUrl ?? defaultUser.image" alt="Profile" class="w-full h-full object-cover" />
          </div>
          <button class="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-xl text-black shadow-lg">
            <Icon name="heroicons:camera-solid" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 text-center sm:text-left space-y-2">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 class="text-2xl font-bold text-white">{{ profile?.userName ?? defaultUser.name }}</h2>
            <div class="flex justify-center gap-2">
              <span
                class="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-green-500/20">Pro</span>
              <span
                class="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-blue-500/20">Verified</span>
            </div>
          </div>
          <p class="text-gray-400">{{ profile?.email ?? defaultUser.email }}</p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
            <Icon name="heroicons:adjustments-horizontal-20-solid" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg text-white">{{ t('appearance') }}</h3>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-gray-800">
            <p class="text-sm font-semibold text-gray-200">{{ t('language') }}</p>
            <div class="flex bg-gray-800 p-1 rounded-xl">
              <button @click="language = 'en'"
                :class="language === 'en' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-200'"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                {{ t('common.english') }}
              </button>
              <button @click="language = 'ar'"
                :class="language === 'ar' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-200'"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                {{ t('common.arabic') }}
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-gray-800">
            <p class="text-sm font-semibold text-gray-200">{{ t('theme') }}</p>
            <div class="flex bg-gray-800 p-1 rounded-xl">
              <button @click="theme = 'light'"
                :class="theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-200'"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                {{ t('light') }}
              </button>
              <button @click="theme = 'dark'"
                :class="theme === 'dark' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-200'"
                class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                {{ t('dark') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
            <Icon name="heroicons:user-20-solid" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg text-white">{{ t('info') }}</h3>
        </div>
        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] uppercase font-bold text-gray-500 tracking-widest px-1">{{ t('name') }}</label>
            <input v-model="defaultUser.name" type="text"
              class="w-full bg-black/40 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="text-center sm:text-left">
        <h3 class="text-red-500 font-bold">Sign Out</h3>
        <p class="text-gray-500 text-xs mt-1">Sign out of your account on this device.</p>
      </div>
      <button @click="handleSignOut"
        class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-bold transition-all duration-300">
        <Icon name="heroicons:arrow-left-on-rectangle-20-solid" class="w-5 h-5" />
        Sign Out
      </button>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-800">
      <button class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">
        {{ t('discard') }}
      </button>
      <button @click="handleSave" :disabled="isSaving"
        class="w-full sm:w-auto bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black px-12 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
        <AppLoadingSpinner v-if="isSaving" class="w-4 h-4" />
        {{ isSaving ? '' : t('save') }}
      </button>
    </div>
  </div>
</template>
