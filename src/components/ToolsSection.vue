<script setup>
defineProps({
  inverse: {
    type: Boolean,
    default: false,
  },
})

const tools = [
  { name: '.NET MAUI',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
  { name: '.NET',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-plain-wordmark.svg' },
  { name: 'AWS',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
  { name: 'Angular',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  { name: 'Azure DevOps', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg' },
  { name: 'Bun',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg' },
  { name: 'Capacitor',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/capacitor/capacitor-original.svg' },
  { name: 'Claude Code',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/claude/claude-original.svg' },
  { name: 'Docker',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Firebase',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
  { name: 'Go',           icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg' },
  { name: 'Jira',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg' },
  { name: 'Liquibase',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/liquibase/liquibase-original.svg' },
  { name: 'Lua',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg' },
  { name: 'Neovim',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neovim/neovim-original.svg' },
  { name: 'Python',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Redis',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
  { name: 'Tmux',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tmux/tmux-original.svg' },
  { name: 'Vue.js',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
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
