<template>
  <div class="cell">
    <div class="card">
      <div class="card-content">
        <p class="title is-5">{{ title }}</p>
        <p class="content">{{ description }}</p>
        <div class="tags" v-if="technologies.length">
          <span class="tag is-light" v-for="(tech, index) in technologies" :key="index">
            {{ tech }}
          </span>
        </div>
        <a
          class="button is-primary"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Project',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    technologies: {
      type: Array,
      default: () => []
    }
  }
}
</script>