<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  body: {
    type: Array,
    default: () => [],
  },
  image: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: '',
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right', 'center'].includes(value),
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

const imageAltText = computed(() => {
  return props.imageAlt || props.title
})

const imageOnly = computed(() => !props.title && bodyItems.value.length === 0)
</script>

<template>
  <section class="section-shell">
    <div
      :class="[
        'section-card',
        'image-section-card',
        imageOnly ? 'image-section-card--image-only' : `image-section-card--${props.align}`,
        props.inverse ? 'surface-inverse' : 'surface-normal',
      ]"
    >
      <div
        v-if="!imageOnly"
        :class="['section-copy', 'image-section-copy', `section-copy--${props.align}`]"
      >
        <h2 v-if="title" class="section-title">{{ title }}</h2>
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
      <div class="image-section-media">
        <img
          class="image-section-media__image"
          :src="image"
          :alt="imageAltText"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>
