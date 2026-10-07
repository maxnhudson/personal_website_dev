<template>
    <section id="projects" class="section">
      <div class="container">
        <h1 class="title">Projects</h1>
        <p>Here are my projects.</p>
        <div class="columns is-multiline">
          <Project
            v-for="(project, index) in projects"
            :key="index"
            :title="project.title"
            :description="project.description"
            :url="project.url"
            :technologies="project.technologies"
          />
        </div>
      </div>
    </section>
</template>

<script>
import Project from '@/components/Project.vue';

export default {
  name: 'Projects',
  components: {
    Project
  },
  data() {
    return {
      projects: [
        {
          title: 'Mushroom Tracker',
          description: 'A React app for tracking mushroom specimens. Browse and search species, log finds on an interactive map, and manage a personal collection with full authentication.',
          url: `${process.env.BASE_URL}mushroom-tracker/`,
          technologies: ['React', 'Vite', 'Leaflet', 'Bootstrap']
        }
      ]
    }
  }
}
</script>