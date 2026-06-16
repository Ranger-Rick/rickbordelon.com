<script setup>
import HeroSection from '../components/HeroSection.vue'
import { sections } from '../data/sections'
</script>

<template>
  <main>
    <HeroSection />
    <component
      v-for="(section, index) in sections"
      :is="section.component"
      :key="section.id"
      :title="section.title"
      :body="section.body"
      :links="section.links"
      :align="section.align"
      :image="section.image"
      :image-alt="section.imageAlt"
      :inverse="index % 2 === 0"
    />
  </main>
</template>
