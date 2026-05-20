<script setup>
import HeroSection from './components/HeroSection.vue'
import FullscreenSection from './components/FullscreenSection.vue'
import RangerSection from './components/RangerSection.vue'
import ToolsSection from './components/ToolsSection.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const sections = [
  {
    id: 'welcome',
    component: FullscreenSection,
    title: 'Welcome',
    align: 'center',
  },
  {
    id: 'about-me',
    component: FullscreenSection,
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
    id: 'tools',
    component: ToolsSection,
  },
  {
    id: 'my-life',
    component: FullscreenSection,
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
  {
    id: 'ranger',
    component: RangerSection,
  }
]
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
      :inverse="index % 2 === 0"
    />
  </main>
</template>
