<template>
  <n-card :bordered="false" :padding="16" class="skill-card">
    <n-h2 weight="bold" class="skill-header">
      {{ header }}
    </n-h2>
    <n-space wrap size="small" class="skill-tags">
      <n-tag v-for="(skill, index) in skills" :key="index">
        {{ skill }}
      </n-tag>
    </n-space>
  </n-card>
</template>

<script setup>
import { NCard, NH2, NSpace, NTag } from 'naive-ui'

defineProps({
  header: {
    type: String,
    required: true
  },
  skills: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.skill-card {
  background-color: var(--n-color-card);
  border: 1px solid var(--n-color-divider);
}

.skill-header {
  margin-bottom: 12px;
}
</style>