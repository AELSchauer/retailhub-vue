<template>
  <div class="container">
    <table class="attribute-list">
      <template v-for="attr in manifestAttributes">
        <component
          :is=attr.vuePath
          :model=model.attributes
          :attribute=attr
        ></component>
      </template>
    </table>
  </div>
</template>

<script>
import BentoDropDownAttribute from '@/components/site-editor/attributes/drop-down'
import BentoRichTextAttribute from '@/components/site-editor/attributes/rich-text'
import BentoTextAttribute from '@/components/site-editor/attributes/text'
import BentoQueryAttribute from '@/components/site-editor/attributes/query'

export default {
  name: 'bento-base-component-attributes',
  data() {
    return {}
  },
  computed: {
    manifestAttributes: function() {
      return this.model.bentoManifest.attributes()
    }
  },
  props: {
    model: Object
  },
  components: {
    BentoDropDownAttribute,
    BentoRichTextAttribute,
    BentoTextAttribute,
    BentoQueryAttribute
  }
}
</script>

<style lang="scss" scoped>
button {
  background: #605B56 !important;
}
.attribute-list {
  text-align: left;
  list-style-type: none;
  padding: 0px;
}
</style>
