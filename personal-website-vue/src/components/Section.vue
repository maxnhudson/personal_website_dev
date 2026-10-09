<template>
  <section :id="id" class="section">
    <div class="container">
      <h1 class="title">{{ title }}</h1>
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'Section',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>