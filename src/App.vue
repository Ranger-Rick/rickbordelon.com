<script setup>
import ThemeToggle from './components/ThemeToggle.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <ThemeToggle class="fixed top-6 right-6 z-30" />
  <router-view />
  <SiteFooter />
</template>
