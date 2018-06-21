<template>
  <div class="container">
    {{ component.name }}
    <button v-on:click="viewDetails">Details</button>
    <!-- children: -->
  </div>
</template>

<script>
// import SiteEditorAttributes from '@/components/site-editor/attributes/index'

export default {
  name: 'bento-base-component-body',
  data() {
    return {}
  },
  props: {
    component: Object
  },
  methods: {
    viewDetails: function() {
      this.$emit('viewComponentDetails', this.component)
    },
  }
  // components: {
  //   SiteEditorAttributes
  // }
}
</script>

<style lang="scss" scoped>
button {
  background: #605B56 !important;
}
</style>
