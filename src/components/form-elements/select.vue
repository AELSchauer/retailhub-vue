<template>
  <div :class="_classMerger('input-wrapper', this.rootClass)">
    <label v-if="labelProperties"
      :for="inputId" 
      :class="_classMerger('form-label', this.labelClass)">
      {{ label }}
    </label>
    <div v-if="error" class="input-error">
      There was a problem rendering this input field
    </div>
    <select 
      :value="get()"
      @input="set($event.target.value)"
      v-bind="inputProperties"
    >
      <option v-for="option in selectOptions"
        :disabled="option.disabled"
        :value="option.value || option.text"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
import _ from 'lodash'
import formHelper from '@/helpers/form-elements'

export default {
  name: 'form-select',
  data() {
    return {
      error: false,
      loading: true,
    }
  },
  props: {
    attribute:     String,
    label:         String,
    inputProps:    Object,
    labelClass:    String,
    rootClass:     String,
    selectOptions: Array,
  },
  computed: {
    inputId: function() {
      return 'input' + this.attribute.camelCase().capitalize()
    },
    inputProperties: function() {
      let defaultInputProps = {
        id: {
          value: this.inputId,
          action: 'overwrite',
        },
        class: {
          value: 'form-input',
          action: 'merge',
        },
      }

      return formHelper.getElementProperties(defaultInputProps, this.inputProps)
    }
  },
  methods: {
    get() {
      return this.$parent.get(this.attribute)
    },
    set(newValue) {
      this.$parent.set(this.attribute, newValue)
    },
    _classMerger(a, b) {
      return formHelper.stringMerger(a, b)
    }
  },
}
</script>

<style scoped lang=scss>
@import "~@/styles/placeholders";

.form-label {
  @extend %form-label;
}
</style>
