<template>
  <div :class="rootProperties.class">
    <label v-if="labelProps"
      :for="inputId" 
      :class="labelProperties.class">
      {{ labelProperties.content }}
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
    attribute:  String,
    inputProps: Object,
    labelProps: Object,
    rootProps:  Object,
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

      return formHelper.getElementProperties(defaultInputProps, this.inputProps)
    },
    rootProperties: function() {
      let defaultRootProps = {
        class: {
          value: 'input-wrapper',
          action: 'merge',
        },
      }

      return formHelper.getElementProperties(defaultRootProps, this.rootProps)
    },
    labelProperties: function() {
      let defaultLabelProps = {
        class: {
          value: 'form-label',
          action: 'merge',
        },
      }

      let properties = formHelper.getElementProperties(defaultLabelProps, this.labelProps)
      delete properties.click

      return properties
    },
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
