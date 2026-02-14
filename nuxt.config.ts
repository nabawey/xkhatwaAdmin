import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'],
    },
  },
  modules: [
    '@nuxt/icon',
    '@nuxt/ui'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
 app: {
    head: {
      title: 'X.Khatwa',
      titleTemplate: '%s | X.Khatwa',
      meta: [
        { name: 'description', content: 'Internal Business Management Tool' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/shoeIco.png' }
      ]
    }
  }
})
