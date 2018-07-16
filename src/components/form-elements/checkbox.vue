<template>
  <div :class="_classMerger('input-wrapper', this.rootClass)">
    <label v-if="label"
      :for="inputId" 
      :class="_classMerger('form-label', this.labelClass)">
      {{ label }}
    </label>
    <div v-if="error" class="input-error">
      There was a problem rendering this input field
    </div>
    <input v-else
      :checked="get()"
      @input="set($event.target.checked)"
      v-bind="inputProperties"
    >
  </div>
</template>

<script>
import _ from 'lodash'
import formHelper from '@/helpers/form-elements'

export default {
  name: 'form-checkbox',
  data() {
    return {
      error: false,
      loading: true,
    }
  },
  props: {
    model:      Object,
    attribute:  String,
    label:      String,
    inputProps: Object,
    labelClass: String,
    rootClass:  String,
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
        type: {
          value: 'checkbox',
          action: 'overwrite',
        },
      }

      return formHelper.getInputProperties(defaultInputProps, this.inputProps)
    }
  },
  methods: {
    get() {
      return this.$parent.get(this.attribute)
    },
    set(newValue) {
      this.$parent.set(this.attribute, newValue)
    },
    _classMerger(classA, classB) {
      return _
        .chain([ classA ])
        .concat([ classB ])
        .compact()
        .join(' ')
        .value()
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
