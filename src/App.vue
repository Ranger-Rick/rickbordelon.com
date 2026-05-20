<script setup>
import HeroSection from './components/HeroSection.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { sections } from './data/sections'
</script>

<template>
  <main>
    <ThemeToggle class="fixed top-6 right-6 z-30" />
    <HeroSection />
    <component
      v-for="(section, index) in sections"
      :is="section.component"
      :key="section.id"
      :title="section.title"
      :body="section.body"
      :align="section.align"
      :image="section.image"
      :image-alt="section.imageAlt"
      :inverse="index % 2 === 0"
    />
  </main>
</template>
