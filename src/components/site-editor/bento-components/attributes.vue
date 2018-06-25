<template>
  <div class="container">
    {{ model.name }}
    <ul class="attribute-list">
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
import BentoRichTextAttribute from '@/components/site-editor/attributes/rich-text'
import BentoTextAttribute from '@/components/site-editor/attributes/text'
import BentoTokenAttribute from '@/components/site-editor/attributes/token'

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
    BentoRichTextAttribute,
    BentoTextAttribute,
    BentoTokenAttribute
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
