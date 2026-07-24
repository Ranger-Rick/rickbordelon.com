<script setup lang="ts">
const links = [
  { label: 'Resume', href: '/resume.pdf' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rick-bordelon' },
  { label: 'GitHub', href: 'https://github.com/Ranger-Rick' },
]

const artistUrl = 'https://www.instagram.com/swordsncats'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <nav class="site-footer__links" aria-label="Personal links">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="site-footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ link.label }}
        </a>
      </nav>
      <p class="site-footer__credit">
        Bordelon's Brew Logo created by
        <a
          :href="artistUrl"
          class="site-footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Swords and Cats
        </a>
      </p>
    </div>
  </footer>
</template>
