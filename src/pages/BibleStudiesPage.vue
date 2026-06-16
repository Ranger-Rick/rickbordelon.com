<script setup lang="ts">
import { computed } from 'vue'
import { studies } from '../data/studies'

const studyLinks = computed(() => {
  return studies.map((study) => ({
    title: study.title,
    href: `/bible-studies/${study.pdf}`,
  }))
})
</script>

<template>
  <main>
    <section class="section-shell">
      <div class="section-card content-card content-card--center surface-normal bible-studies-card">
        <div class="section-copy section-copy--center section-copy--wide">
          <h1 class="section-title">Bible Studies</h1>
          <div v-if="studyLinks.length" class="studies-list">
            <a
              v-for="study in studyLinks"
              :key="study.href"
              :href="study.href"
              class="study-item"
            >
              <span class="study-item__title">{{ study.title }}</span>
              <svg
                class="study-item__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </a>
          </div>
          <div v-else class="studies-empty">
            <p class="studies-empty__text">No studies available yet.</p>
          </div>
          <div class="studies-back">
            <router-link to="/" class="section-link">
              Back to Home
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
