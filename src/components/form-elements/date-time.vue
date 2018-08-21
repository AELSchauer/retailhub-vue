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
      :value="get()"
      @input="set($event.target.value)"
      v-bind="inputProperties"
    >
  </div>
</template>

<script>
import _ from 'lodash'
// import moment from 'moment'
import formHelper from '@/helpers/form-elements'

export default {
  name: 'form-date-time',
  data() {
    return {
      error: false,
      loading: true,
      // See this page for origins of this list:
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
      allowedTypes: [ 'date', 'datetime-local' ]
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
      }

      if (this.inputProps.min) {
        this.inputProps.min = this.inputProps.min.format(this.inputFormat)
      }
      if (this.inputProps.max) {
        this.inputProps.max = this.inputProps.max.format(this.inputFormat)
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
    inputFormat: function() {
      if (this.inputProps.type === 'date') {
        return 'YYYY-MM-DD';
      }
      else {
        return 'YYYY-MM-DDTHH:mm'
      }
    }
  },
  created() {
    this.verifyType()
  },
  methods: {
    get() {
      let attribute = this.$parent.get(this.attribute)
      return (attribute) ? (attribute.format(this.inputFormat)) : (null)
    },
    set(newValue) {
      this.$parent.set(this.attribute, newValue)
    },
    verifyType() {
      if (!_.includes(this.allowedTypes, this.inputProps.type)) {
        console.error(`ERROR: The input type '${this.inputProps.type}' is not supported. ` +
          'It may be able to be invoked with another form component.')
        this.error = true
      }
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
