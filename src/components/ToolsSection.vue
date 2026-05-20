<script setup>
defineProps({
  inverse: {
    type: Boolean,
    default: false,
  },
})

const tools = [
  { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-plain-wordmark.svg' },
  { name: '.NET MAUI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
  { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg' },
  { name: 'Neovim', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neovim/neovim-original.svg' },
]
</script>

<template>
  <section class="section-shell">
    <div
      :class="[
        'section-card',
        'content-card',
        'content-card--center',
        inverse ? 'surface-inverse' : 'surface-normal',
      ]"
    >
      <div class="section-copy section-copy--center section-copy--wide">
        <h2 class="section-title">Skills</h2>
        <div class="tools-grid">
          <div v-for="tool in tools" :key="tool.name" class="tools-grid__item">
            <img :src="tool.icon" :alt="tool.name" class="tools-grid__icon" />
            <span class="tools-grid__label">{{ tool.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
