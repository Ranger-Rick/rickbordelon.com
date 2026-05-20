<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const eyeRefs = ref([])
const pupilOffsets = ref([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
])

function setEyeRef(element, index) {
  eyeRefs.value[index] = element
}

function handleMouseMove(event) {
  pupilOffsets.value = eyeRefs.value.map((eye) => {
    if (!eye) {
      return { x: 0, y: 0 }
    }

    const rect = eye.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const maxOffsetX = 22
    const maxOffsetY = 10

    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, deltaX * 0.14)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, deltaY * 0.12)),
    }
  })
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="section-shell">
    <section ref="sectionRef" class="ranger-section">
      <div class="ranger-section__eyes">
        <div
          class="ranger-section__eye"
          :ref="(element) => setEyeRef(element, 0)"
        >
          <div
            class="ranger-section__pupil"
            :style="{
              transform: `translate(calc(-50% + ${pupilOffsets[0]?.x ?? 0}px), calc(-50% + ${pupilOffsets[0]?.y ?? 0}px))`,
            }"
          ></div>
        </div>
        <div
          class="ranger-section__eye"
          :ref="(element) => setEyeRef(element, 1)"
        >
          <div
            class="ranger-section__pupil"
            :style="{
              transform: `translate(calc(-50% + ${pupilOffsets[1]?.x ?? 0}px), calc(-50% + ${pupilOffsets[1]?.y ?? 0}px))`,
            }"
          ></div>
        </div>
      </div>
      <p class="ranger-section__disclaimer">
        Careful! Ranger is always waiting to pounce!
      </p>
    </section>
  </div>
</template>
