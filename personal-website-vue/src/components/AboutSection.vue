<template>
  <Section :id="id" :title="title">
    <div class="columns">
      <div class="column is-half">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="@/assets/Profile Picture 1-7-26 smaller.png" alt="About image" class="responsive-about-img"/>
            </figure>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <p class="title is-5">More About Me</p>
            <p class="content">
              Add your about me text here. You can include information about your background,
              interests, experience, or anything else you'd like visitors to know about you.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script>
import Section from '@/components/Section.vue';

export default {
  name: 'AboutSection',
  components: {
    Section
  },
  props: {
    id: {
      type: String,
      default: 'about'
    },
    title: {
      type: String,
      default: 'About Me'
    }
  }
}
</script>

<style scoped>
.responsive-about-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .columns {
    flex-direction: column;
  }

  .column {
    margin-bottom: 1rem;
  }
}
</style>