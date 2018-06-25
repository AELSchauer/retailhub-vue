<template>
  <div class="attribute">
    <div v-if="isShowingAttributeInput" class="row">
      <span class="attribute-label col-md-4">
        {{ attribute.name }}:
      </span>
      <span class="attribute-input col-md-8">
        form goes here!
        <button @click="toggleShowingAttributeInput">cancel</button>
      </span>
    </div>
    <div v-else class="row">
      <span class="attribute-label col-md-4" @click="toggleShowingAttributeInput">
        {{ attribute.name }}:
      </span>
      <span class="attribute-value col-md-8" :class="[{ 'default-value': getChangesetAttribute.isDefault }]">
        {{ getChangesetAttribute.value }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bento-text-attribute',
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
    getChangesetAttribute: function() {
      let val = this.changeset[this.attribute.name]
      if (val) {
        return { value: val, isDefault: false }
      }
      else {
        return { value: this.attribute.manifest.default, isDefault: true }
      }
    },
  },
  methods: {
    toggleShowingAttributeInput: function() {
      this.isShowingAttributeInput = !this.isShowingAttributeInput;
    },
  }
}
</script>

<style lang="scss" scoped>
// button {
//   background: #605B56 !important;
// }
// .attribute-label {
//   padding: 0px;
// }
// .attribute-input, .attribute-value {
//   padding: 0 10px 0 0;
// }
.default-value {
  font-style: italic;
}
</style>
