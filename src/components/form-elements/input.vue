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
    <template v-else>
      <input
        :value="get()"
        @input="set($event.target.value)"
        v-bind="inputProperties">
      <input v-if="toggleProps"
        type="checkbox"
        :checked="getToggle()"
        @input="setToggle($event.target.checked)"
        :class="_classMerger('form-input', this.toggleProps.class)">
    </template>
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
    attribute:   String,
    inputProps:  Object,
    labelProps:  Object,
    rootProps:   Object,
    toggleProps: Object,
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
      return this.$parent.get(this.toggleProps.attribute)
    },
    setToggle(newValue) {
      this.$parent.set(this.toggleProps.attribute, newValue)
    },
    verifyType() {
      if (!_.includes(this.allowedTypes, this.inputProps.type)) {
        console.error(`ERROR: The input type '${this.inputProps.type}' is not supported. ` +
          'It may be able to be invoked with another form component.')
        this.error = true
      }
    },
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
.attribute-wrapper {
  padding: 0;
}
.attribute-label {
  padding: 0 15px;
  text-align: left;
}
</style>
