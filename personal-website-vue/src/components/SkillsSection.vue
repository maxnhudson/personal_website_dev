<template>
  <Section :id="id" :title="title">
    <div class="grid">
      <div class="cell" v-for="(skill, index) in skills" :key="index">
        <div class="card">
          <div class="card-content">
            <p class="title is-5">{{ skill }}</p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script>
import Section from '@/components/Section.vue';

export default {
  name: 'SkillsSection',
  components: {
    Section
  },
  props: {
    id: {
      type: String,
      default: 'skills'
    },
    title: {
      type: String,
      default: 'Skills'
    },
    skills: {
      type: Array,
      default: () => [
        'C, C++, Java, JavaScript, TypeScript, Python',
        'React and Vue and front-end development ',
        'Back-end development and SQL, PostgreSQL',
        'Frameworks using ORMs',
        'Virtualization and containerization technologies',
        'Pytorch'
      ]
    }
  }
}
</script>

<style scoped>
</style>