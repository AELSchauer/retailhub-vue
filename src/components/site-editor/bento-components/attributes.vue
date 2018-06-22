<template>
  <div class="container">
    {{ model.name }}
    <ul>
      <li v-for="attr in model.manifestAttributes">
        <component
          :is=attr.vuePath
          :changeset=model.attributes
          :attribute=attr
        ></component>
      </li>
    </ul>
  </div>
</template>

<script>
import BentoDropDownAttribute from '@/components/site-editor/attributes/drop-down'
import BentoTextAttribute from '@/components/site-editor/attributes/text'

export default {
  name: 'bento-base-component-attributes',
  data() {
    return {}
  },
  props: {
    model: Object
  },
  components: {
    BentoDropDownAttribute,
    BentoTextAttribute
  }
}
</script>

<style lang="scss" scoped>
button {
  background: #605B56 !important;
}
</style>
