<template>
  <section id="skills" class="section">
    <div class="container">
      <h1 class="title">Skills</h1>
      <div class="grid">
        <div class="cell" v-for="(skill, index) in skills" :key="index">
          <div class="card">
            <div class="card-content">
              <p class="title is-5">{{ skill }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SkillSection',
  props: {
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