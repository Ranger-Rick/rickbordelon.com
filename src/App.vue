<script setup>
import HeroSection from './components/HeroSection.vue'
import FullscreenSection from './components/FullscreenSection.vue'
import RangerSection from './components/RangerSection.vue'
import ToolsSection from './components/ToolsSection.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const sections = [
  {
    title: 'Welcome',
    align: 'center'

  },
  {
    title: 'About Me',
    align: 'left',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer blandit, nisi id faucibus faucibus, dui velit suscipit eros, a tempus nunc mi at mauris.',
      'Curabitur ut nisl ut erat tincidunt placerat. Vivamus gravida, ipsum ac luctus finibus, arcu sapien feugiat turpis, vitae malesuada nisl lectus sit amet justo.',
      {
        text: 'Suspendisse potenti. Maecenas a est ac augue consequat commodo. In non lectus sed ipsum aliquet volutpat eget non nisl.',
        links: [
          {
            label: 'GitHub',
            href: 'https://github.com/',
          },
          {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/',
          },
        ],
      },
    ],
  },
  {
    title: 'My Life',
    align: 'right',
    body: [
      {
        text: 'Here is my story',
        links: [
          {
            label: 'Future internal route',
            href: '/about',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <main>
    <ThemeToggle class="fixed top-6 right-6 z-30" />
    <HeroSection />
    <FullscreenSection
      v-for="(section, index) in sections"
      :key="section.title"
      :title="section.title"
      :body="section.body"
      :align="section.align"
      :inverse="index % 2 === 0"
    />
    <ToolsSection :inverse="sections.length % 2 === 0" />
    <RangerSection />
  </main>
</template>
