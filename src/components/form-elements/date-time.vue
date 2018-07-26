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
      }

      if (this.inputProps.min) {
        this.inputProps.min = this.inputProps.min.format(this.inputFormat)
      }
      if (this.inputProps.max) {
        this.inputProps.max = this.inputProps.max.format(this.inputFormat)
      }

      return formHelper.getElementProperties(defaultInputProps, this.inputProps)
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
      return this.$parent.get(this.attribute).format(this.inputFormat)
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
