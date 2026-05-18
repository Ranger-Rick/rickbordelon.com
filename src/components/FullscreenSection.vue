<script setup>
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
        <div v-if="props.body.length" class="section-body">
          <p v-for="paragraph in props.body" :key="paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
