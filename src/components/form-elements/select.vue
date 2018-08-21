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
    <select 
      :value="get()"
      @input="set($event.target.value)"
      v-bind="inputProperties"
    >
      <option disabled :selected="!get()">
        Please select one:
      </option>
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
    inputProps:    Object,
    labelProps:    Object,
    rootProps:     Object,
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
        multiple: {
          action: 'delete',
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
  },
}
</script>

<style scoped lang=scss>
@import "~@/styles/placeholders";
.form-label {
  @extend %form-label;
}
</style>
