<template>
  <div class="container">
    {{ component.name }}
    <ul>
      <li v-for="attribute in component.attributes">
        {{ attribute.name }}
      </li>
    </ul>
  </div>
</template>

<script>
// import SiteEditorAttributes from '@/components/site-editor/attributes/index'

export default {
  name: 'bento-base-component-attributes',
  data() {
    return {}
  },
  props: {
    component: Object
  },
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
