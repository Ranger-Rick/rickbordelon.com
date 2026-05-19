<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: Array,
    default: () => [],
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
})

const bodyItems = computed(() => {
  return props.body
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          key: `${index}-${item}`,
          text: item,
          links: [],
        }
      }

      if (!item || typeof item !== 'object') {
        return null
      }

      return {
        key: `${index}-${item.text ?? 'links'}`,
        text: item.text ?? '',
        links: Array.isArray(item.links)
          ? item.links.filter((link) => link?.label && link?.href)
          : [],
      }
    })
    .filter((item) => item && (item.text || item.links.length))
})

const isExternalLink = (href) => {
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
            <p v-if="item.text">{{ item.text }}</p>
            <div v-if="item.links.length" class="section-links">
              <a
                v-for="link in item.links"
                :key="`${item.key}-${link.href}`"
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
      </div>
    </div>
  </section>
</template>
