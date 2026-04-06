<template>
  <div class="home">
    <section id="hero" class="hero is-primary">
      <div class="hero-body">
        
      </div>
    </section>

    <AboutSection id="about" />
    <SkillSection id="skills"/>
    <Projects id="projects" />
    <!-- <ContactSection id="contact"/> -->

  </div>
</template>

<script>
import AboutSection from '@/components/AboutSection.vue';
import SkillSection from '@/components/SkillSection.vue';
import Projects from '@/components/Projects.vue';
import ContactSection from '@/components/ContactSection.vue';

export default {
  name: 'HomeView',
  components: {
    AboutSection,
    SkillSection,
    Projects,
    ContactSection
  }
}
</script>

<style>
</style>
