<template>
  <Section :id="id" :title="title">
    <p>Get in touch.</p>
  </Section>
</template>

<script>
import Section from '@/components/Section.vue';

export default {
  name: 'ContactSection',
  components: {
    Section
  },
  props: {
    id: {
      type: String,
      default: 'contact'
    },
    title: {
      type: String,
      default: 'Contact'
    }
  }
}
</script>