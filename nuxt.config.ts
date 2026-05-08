export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'dark',
  },
  i18n: {
    defaultLocale: 'de',
    locales: [
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    strategy: 'prefix_except_default',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/globals.css',
    configPath: 'tailwind.config',
  },
  nitro: {
    storage: {
      data: { driver: 'fs', base: './data' },
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
})
