<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import type { SectionAlignment, SectionBodyItem, SectionLinks } from '../types/section'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: Array as PropType<SectionBodyItem[]>,
    default: () => [],
  },
  links: {
    type: Array as PropType<SectionLinks>,
    default: () => [],
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String as PropType<SectionAlignment>,
    default: 'left',
    validator: (value: SectionAlignment) => ['left', 'center', 'right'].includes(value),
  },
})

const bodyItems = computed(() => {
  return props.body
    .filter((item) => typeof item === 'string' && item)
    .map((item, index) => ({
      key: `${index}-${item}`,
      text: item,
    }))
})

const sectionLinks = computed(() => {
  return props.links.filter((link) => link?.label && link?.href)
})

const isExternalLink = (href: string) => {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}
</script>

<template>
  <section class="section-shell">
    <div
      :class="[
        'section-card',
        'content-card',
        `content-card--${props.align}`,
        props.inverse ? 'surface-inverse' : 'surface-normal',
      ]"
    >
      <div :class="['section-copy', `section-copy--${props.align}`]">
        <h2 class="section-title">{{ title }}</h2>
        <div v-if="bodyItems.length" class="section-body">
          <div v-for="item in bodyItems" :key="item.key" class="section-body__item">
            <p>{{ item.text }}</p>
          </div>
        </div>
        <div v-if="sectionLinks.length" class="section-links">
          <a
            v-for="link in sectionLinks"
            :key="link.href"
            class="section-link"
            :href="link.href"
            :target="isExternalLink(link.href) ? '_blank' : undefined"
            :rel="isExternalLink(link.href) ? 'noreferrer' : undefined"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
