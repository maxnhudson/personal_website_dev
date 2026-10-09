<template>
  <div class="home">
    <section id="hero" class="hero is-primary">
      <div class="hero-body">

      </div>
    </section>

    <component
      v-for="section in sections"
      :key="section.id"
      :is="section.component"
      :id="section.id"
      :title="section.title"
    />
  </div>
</template>

<script>
import sections from '@/sections';

export default {
  name: 'HomeView',
  data() {
    return {
      sections
    }
  }
}
</script>

<style>
</style>