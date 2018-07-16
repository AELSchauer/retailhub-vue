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
    <input v-if="toggle"
      type="checkbox"
      :checked="getToggle()"
      @input="setToggle($event.target.checked)"
      :class="_classMerger('form-input', this.toggle.class)"
    >
  </div>
</template>

<script>
import _ from 'lodash'
import formHelper from '@/helpers/form-elements'
import FormCheckbox from '@/components/form-elements/checkbox'

export default {
  name: 'form-input',
  data() {
    return {
      error: false,
      loading: true,
      // See this page for origins of this list:
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
      allowedTypes: [
        'email', 'hidden', 'number', 'password', 'range', 
        'tel', 'text', 'url'
      ]
      // radio, checkbox, date, and datetime-local types are not supported here because the way
      // the data is processed means they should be separate components
    }
  },
  props: {
    attribute:  String,
    label:      String,
    inputProps: Object,
    labelClass: String,
    rootClass:  String,
    toggle:     Object,
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

      return formHelper.getInputProperties(defaultInputProps, this.inputProps)
    }
  },
  created() {
    this.verifyType()
  },
  methods: {
    get() {
      return this.$parent.get(this.attribute)
    },
    set(newValue) {
      this.$parent.set(this.attribute, newValue)
    },
    getToggle() {
      return this.$parent.get(this.toggle.attribute)
    },
    setToggle(newValue) {
      this.$parent.set(this.toggle.attribute, newValue)
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
  components: {
    FormCheckbox,
  },
}
</script>

<style scoped lang=scss>
@import "~@/styles/placeholders";

.form-label {
  @extend %form-label;
}
</style>
