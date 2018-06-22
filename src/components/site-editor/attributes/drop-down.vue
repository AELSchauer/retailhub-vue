<template>
  <div class="attribute">
    <div v-if="isShowingAttributeInput">
      form goes here
    </div>
    <div v-else>
      <span class="attribute-display">
        {{ attribute.name }}:
      </span>
      <span class="attribute-value">
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bento-drop-down-attribute',
  data() {
    return {
      isShowingAttributeInput: false,
    }
  },
  props: {
    attribute: Object,
    changeset: Object
  },
  computed: {
    value: function() {
      return this.changeset[this.attribute.name]
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  background: #605B56 !important;
}
</style>
